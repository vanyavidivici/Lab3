// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract FundraisingContract {
    struct User {
        bytes32 passwordHash;
        string login;
        address userAddress; // Add the address field
        bool isLoggedIn;
    }

    struct Project {
        string name;
        address payable owner;
        uint256 goalAmount;
        uint256 currentAmount;
        uint256 deadline;
        bool isOpen;
        string[] contributors;
        mapping(string => uint256) contributions;
    }

    mapping(string => User) private users;
    mapping(uint256 => Project) private projects;

    uint256 public projectCount;
    address public contractOwner;

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only contract owner can perform this action.");
        _;
    }

    modifier onlyProjectOwner(uint256 projectId) {
        require(msg.sender == projects[projectId].owner, "Only project owner can perform this action.");
        _;
    }

    modifier onlyLoggedIn(string memory _login) {
        // Перевірка чи змінилась адреса користувача
        if (users[_login].userAddress != msg.sender) {
            users[_login].isLoggedIn = false; // Вимикаємо логін, якщо адреса змінилась
        }

        require(users[_login].isLoggedIn, "User must be logged in to perform this action.");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    // User registration
    function registerUser(string memory _login, string memory _password) public {
        require(bytes(_login).length > 0, "Login cannot be empty.");
        require(users[_login].passwordHash == 0, "User already exists.");

        users[_login] = User({
            login: _login,
            passwordHash: keccak256(abi.encodePacked(_password)),
            userAddress: msg.sender,  // Store the user's address
            isLoggedIn: false
        });
    }


    // User login
    function loginUser(string memory _login, string memory _password) public {
        User storage user = users[_login];
        require(user.passwordHash != 0, "User does not exist.");
        require(user.passwordHash == keccak256(abi.encodePacked(_password)), "Invalid password.");

        user.isLoggedIn = true;
    }

    // User logout
    function logoutUser(string memory _login) public onlyLoggedIn(_login) {
        User storage user = users[_login];
        user.isLoggedIn = false;
    }

    // Create a new project
    function createProject(
        string memory name,
        uint256 goalAmount,
        uint256 durationInDays,
        string memory _login
    ) public onlyLoggedIn(_login) {
        require(bytes(name).length > 0, "Project name cannot be empty.");
        require(goalAmount > 0, "Goal amount must be greater than zero.");
        require(durationInDays > 0, "Duration must be greater than zero.");

        projectCount++;
        Project storage newProject = projects[projectCount];
        newProject.name = name;
        newProject.owner = payable(msg.sender);
        newProject.goalAmount = goalAmount * 1 ether;
        newProject.currentAmount = 0;
        newProject.deadline = block.timestamp + (durationInDays * 1 days);
        newProject.isOpen = true;
    }

    // Contribute to a project
    function contributeToProject(uint256 projectId, string memory _login) public payable onlyLoggedIn(_login) {
        Project storage project = projects[projectId];
        require(project.isOpen, "Project is not open for contributions.");
        require(block.timestamp <= project.deadline, "Project deadline has passed.");
        require(msg.value > 0, "Contribution must be greater than zero.");

        if (project.contributions[_login] == 0) {
            project.contributors.push(_login);
        }

        project.contributions[_login] += msg.value;
        project.currentAmount += msg.value;

        if (project.currentAmount >= project.goalAmount) {
            project.isOpen = false;
        }
    }

    // Refund all contributors
    function refundAll(uint256 projectId, string memory _login) public onlyProjectOwner(projectId) onlyLoggedIn(_login) {
        Project storage project = projects[projectId];
        require(block.timestamp > project.deadline, "Project deadline has not passed.");
        require(project.currentAmount < project.goalAmount, "Project has reached its goal.");

        for (uint256 i = 0; i < project.contributors.length; i++) {
            string memory contributor = project.contributors[i];
            uint256 amount = project.contributions[contributor];
            if (amount > 0) {
                project.contributions[contributor] = 0;
                payable(users[contributor].userAddress).transfer(amount);  // Use userAddress
            }
        }
    }


    // Change project deadline
    function changeDeadline(uint256 projectId, int256 additionalDays, string memory _login) public onlyProjectOwner(projectId) onlyLoggedIn(_login) {
        Project storage project = projects[projectId];
        require(project.isOpen, "Project is not open.");

        // Якщо additionalDays додатне, додаємо до дедлайну
        if (additionalDays >= 0) {
            project.deadline += uint256(additionalDays) * 1 days;
        }
        // Якщо additionalDays від'ємне, перевіряємо, чи не буде дедлайн у минулому
        else {
            uint256 newDeadline = project.deadline - uint256(-additionalDays) * 1 days;
            if (newDeadline >= block.timestamp) {
                project.isOpen = false;
            }
            project.deadline = newDeadline;
        }
    }

    // Get user contribution
    function getContribution(uint256 projectId, string memory _login) public view returns (uint256) {
        return projects[projectId].contributions[_login];
    }

    // Get project contributors
    function getContributors(uint256 projectId) public view returns (string[] memory, uint256[] memory) {
        Project storage project = projects[projectId];
        uint256 contributorCount = project.contributors.length;
        uint256[] memory contributions = new uint256[](contributorCount);

        for (uint256 i = 0; i < contributorCount; i++) {
            contributions[i] = project.contributions[project.contributors[i]];
        }

        return (project.contributors, contributions);
    }

    // Check project status
    function isProjectOpen(uint256 projectId) public view returns (bool) {
        return projects[projectId].isOpen;
    }

    function getProjectReport() public view returns (string[] memory successfulProjects, uint256[] memory successfulAmounts, string[] memory failedProjects, uint256[] memory failedAmounts) {
        uint256 successfulCount = 0;
        uint256 failedCount = 0;

        // Підраховуємо кількість успішних та неуспішних проектів
        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage project = projects[i];
            if (project.currentAmount >= project.goalAmount) {
                successfulCount++;
            } else {
                failedCount++;
            }
        }

        // Створюємо масиви для успішних та неуспішних проектів
        successfulProjects = new string[](successfulCount);
        successfulAmounts = new uint256[](successfulCount);
        failedProjects = new string[](failedCount);
        failedAmounts = new uint256[](failedCount);

        uint256 successfulIndex = 0;
        uint256 failedIndex = 0;

        // Заповнюємо масиви відповідно до статусу проектів
        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage project = projects[i];
            if (project.currentAmount >= project.goalAmount) {
                successfulProjects[successfulIndex] = project.name;
                successfulAmounts[successfulIndex] = project.currentAmount;
                successfulIndex++;
            } else {
                failedProjects[failedIndex] = project.name;
                failedAmounts[failedIndex] = project.currentAmount;
                failedIndex++;
            }
        }
    }
}