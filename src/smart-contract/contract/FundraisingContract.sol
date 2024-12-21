// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract FundraisingContract {
    struct User {
        bytes32 passwordHash;
        string login;
        address userAddress;
        bool isLoggedIn;
    }

    struct Project {
        string name;
        string description;
        address payable owner;
        uint256 goalAmount;
        uint256 currentAmount;
        uint256 deadline;
        bool isOpen;
        string[] contributors;
        mapping(string => uint256) contributions;
    }

    struct ProjectInfo {
        string name;
        string description;
        uint256 goalAmount;
        uint256 deadline;
        bool isOpen;
    }

    struct Contribution {
        string username;
        uint256 sum;
    }

    struct ProjectReport {
        string name;
        string description;
        uint256 goalAmount;
        uint256 receivedAmount;
        uint256 deadline;
    }

    mapping(string => address) private userAddresses;
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
        if (users[_login].userAddress != msg.sender) {
            users[_login].isLoggedIn = false;
        }
        require(users[_login].isLoggedIn, "User must be logged in to perform this action.");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    function registerUser(string memory _login, string memory _password) public {
        require(userAddresses[_login] == address(0), "Username already taken.");
        require(bytes(_login).length > 0, "Login cannot be empty.");
        require(users[_login].passwordHash == 0, "User already exists.");

        users[_login] = User({
            login: _login,
            passwordHash: keccak256(abi.encodePacked(_password)),
            userAddress: msg.sender,
            isLoggedIn: false
        });

        userAddresses[_login] = msg.sender;
    }

    function loginUser(string memory _login, string memory _password) public {
        User storage user = users[_login];
        require(user.passwordHash != 0, "User does not exist.");
        require(user.passwordHash == keccak256(abi.encodePacked(_password)), "Invalid password.");

        user.isLoggedIn = true;
    }

    function logoutUser(string memory _login) public onlyLoggedIn(_login) {
        User storage user = users[_login];
        user.isLoggedIn = false;
    }

    function createProject(
        string memory name,
        string memory description,
        uint256 goalAmount,
        uint256 durationInDays,
        string memory _login
    ) public onlyLoggedIn(_login) returns (uint256) {
        require(bytes(name).length > 0, "Project name cannot be empty.");
        require(bytes(description).length > 0, "Project description cannot be empty.");
        require(goalAmount > 0, "Goal amount must be greater than zero.");
        require(durationInDays > 0, "Duration must be greater than zero.");

        projectCount++;
        Project storage newProject = projects[projectCount];
        newProject.name = name;
        newProject.description = description;
        newProject.owner = payable(msg.sender);
        newProject.goalAmount = goalAmount * 1 ether;
        newProject.currentAmount = 0;
        newProject.deadline = block.timestamp + (durationInDays * 1 days);
        newProject.isOpen = true;

        return projectCount;
    }

    function getProject(uint256 projectId) public view returns (
        string memory name,
        string memory description,
        address owner,
        uint256 goalAmount,
        uint256 currentAmount,
        uint256 deadline,
        bool isOpen,
        string[] memory contributors
    ) {
        Project storage project = projects[projectId];
        return (
            project.name,
            project.description,
            project.owner,
            project.goalAmount,
            project.currentAmount,
            project.deadline,
            project.isOpen,
            project.contributors
        );
    }

    function getProjectReport(uint256 projectId) public view returns (ProjectInfo memory) {
        Project storage project = projects[projectId];
        return ProjectInfo({
            name: project.name,
            description: project.description,
            goalAmount: project.goalAmount,
            deadline: project.deadline,
            isOpen: project.isOpen
        });
    }

    function changeProject(
        uint256 projectId,
        string memory name,
        string memory description,
        uint256 goalAmount,
        uint256 deadline,
        bool isOpen, 
        string memory _login
        ) public onlyLoggedIn(_login) onlyProjectOwner(projectId) {
        Project storage project = projects[projectId];
        project.name = name;
        project.description = description;
        project.goalAmount = goalAmount;
        project.deadline = deadline;
        project.isOpen = isOpen;
    }

    function deleteProject(uint256 projectId, string memory _login) public onlyLoggedIn(_login) onlyProjectOwner(projectId) {
        delete projects[projectId];
    }

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

    function getUserBalance(string memory username) public view returns (uint256) {
        address user = userAddresses[username];
        require(user != address(0), "User does not exist.");
        return user.balance;
    }

    function refundAll(uint256 projectId, string memory _login) public onlyProjectOwner(projectId) onlyLoggedIn(_login) {
        Project storage project = projects[projectId];
        require(block.timestamp > project.deadline, "Project deadline has not passed.");
        require(project.currentAmount < project.goalAmount, "Project has reached its goal.");

        for (uint256 i = 0; i < project.contributors.length; i++) {
            string memory contributor = project.contributors[i];
            uint256 amount = project.contributions[contributor];
            if (amount > 0) {
                project.contributions[contributor] = 0;
                payable(users[contributor].userAddress).transfer(amount);
            }
        }
    }

    function changeDeadline(uint256 projectId, int256 additionalDays, string memory _login) public onlyProjectOwner(projectId) onlyLoggedIn(_login) {
        Project storage project = projects[projectId];
        require(project.isOpen, "Project is not open.");

        if (additionalDays >= 0) {
            project.deadline += uint256(additionalDays) * 1 days;
        } else {
            uint256 newDeadline = project.deadline - uint256(-additionalDays) * 1 days;
            if (newDeadline >= block.timestamp) {
                project.isOpen = false;
            }
            project.deadline = newDeadline;
        }
    }

    function getContribution(uint256 projectId, string memory _login) public view returns (uint256) {
        return projects[projectId].contributions[_login];
    }

    function getContributors(uint256 projectId) public view returns (Contribution[] memory) {
        Project storage project = projects[projectId];
        uint256 contributorCount = project.contributors.length;
        Contribution[] memory contributions = new Contribution[](contributorCount);

        for (uint256 i = 0; i < contributorCount; i++) {
            contributions[i] = Contribution({
                username: project.contributors[i],
                sum: project.contributions[project.contributors[i]]
            });
        }

        return contributions;
    }

    function isProjectOpen(uint256 projectId) public view returns (bool) {
        return projects[projectId].isOpen;
    }

    function getOpenProjects() public view returns (ProjectReport[] memory) {
        uint256 openProjectCount = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            if (projects[i].isOpen) {
                openProjectCount++;
            }
        }

        ProjectReport[] memory openProjects = new ProjectReport[](openProjectCount);
        uint256 openProjectIndex = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage project = projects[i];
            if (project.isOpen) {
                openProjects[openProjectIndex] = ProjectReport({
                    name: project.name,
                    description: project.description,
                    goalAmount: project.goalAmount,
                    receivedAmount: project.currentAmount,
                    deadline: project.deadline
                });
                openProjectIndex++;
            }
        }

        return openProjects;
    }

    function getProjectsReport() public view returns (ProjectReport[] memory successfulProjects, ProjectReport[] memory failedProjects) {
        uint256 successfulCount = 0;
        uint256 failedCount = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage project = projects[i];
            if (project.currentAmount >= project.goalAmount) {
                successfulCount++;
            } else {
                failedCount++;
            }
        }

        successfulProjects = new ProjectReport[](successfulCount);
        failedProjects = new ProjectReport[](failedCount);

        uint256 successfulIndex = 0;
        uint256 failedIndex = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage project = projects[i];
            if (project.currentAmount >= project.goalAmount) {
                successfulProjects[successfulIndex] = ProjectReport({
                    name: project.name,
                    description: project.description,
                    goalAmount: project.goalAmount,
                    receivedAmount: project.currentAmount,
                    deadline: project.deadline
                });
                successfulIndex++;
            } else {
                failedProjects[failedIndex] = ProjectReport({
                    name: project.name,
                    description: project.description,
                    goalAmount: project.goalAmount,
                    receivedAmount: project.currentAmount,
                    deadline: project.deadline
                });
                failedIndex++;
            }
        }
    }
}