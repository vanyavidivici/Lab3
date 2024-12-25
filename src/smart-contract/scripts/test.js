const Web3Lib = require('web3');
const { abi, bytecode } = require('./compile');
const { expect } = require("chai");

const web3 = new Web3Lib.Web3('http://127.0.0.1:8545');

let accounts;
let fundraisingContract;

const deploy = async () => {
    accounts = await web3.eth.getAccounts();
    fundraisingContract = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: 5000000 });
};

describe('FundraisingContract', function () {
    before(async () => {
        await deploy();
    });

    it('should deploy the contract', async () => {
        expect(fundraisingContract.options.address).to.exist;
    });

    it('should register users', async () => {
        await fundraisingContract.methods.registerUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await fundraisingContract.methods.registerUser("testUser2", "testPassword2").send({ from: accounts[1] });

        const userAddress1 = await fundraisingContract.methods.getUserAddress("testUser1").call();
        const userAddress2 = await fundraisingContract.methods.getUserAddress("testUser2").call();

        expect(userAddress1).to.equal(accounts[0]);
        expect(userAddress2).to.equal(accounts[1]);
    });

    it('should get user balance', async () => {
        const balance = await fundraisingContract.methods.getUserBalance("testUser1").call();

        expect(balance.toString()).to.equal('100');
    });

    it('should allow users to login', async () => {
        await fundraisingContract.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await fundraisingContract.methods.loginUser("testUser2", "testPassword2").send({ from: accounts[1] });

        const user1 = await fundraisingContract.methods.getUser("testUser1").call();
        const user2 = await fundraisingContract.methods.getUser("testUser2").call();

        expect(user1[3]).to.be.true;
        expect(user2[3]).to.be.true;
    });

    it('should create a project', async () => {
        const timestamp = Math.floor(Date.now() / 1000 + 60 * 60);
        await fundraisingContract.methods.createProject("Project1", "Description1", 10, timestamp, "testUser1").send({ from: accounts[0] });
        const project = await fundraisingContract.methods.getProject(1).call();

        expect(project.name).to.equal("Project1");
        expect(project.goalAmount.toString()).to.equal('10');
        expect(project.owner).to.equal(accounts[0]);
    });

    it('should update a project', async () => {
        const timestamp = Math.floor(Date.now() / 1000 + 60 * 60 * 24);
        await fundraisingContract.methods.changeProject(1, "Updated Project", "Updated Description", 20, timestamp, true, "testUser1").send({ from: accounts[0] });
        const project = await fundraisingContract.methods.getProject(1).call();

        expect(project.name).to.equal("Updated Project");
        expect(project.description).to.equal("Updated Description");
        expect(project.goalAmount.toString()).to.equal('20');
        expect(project.deadline.toString()).to.equal(timestamp.toString());
    });

    it('should allow contributions to a project', async () => {
        await fundraisingContract.methods.contributeToProject(1, 5, "testUser2").send({ from: accounts[1] });
        const project = await fundraisingContract.methods.getProject(1).call();

        expect(project.currentAmount.toString()).to.equal('5');
    });

    it('should get user contributions', async () => {
        const contribution = await fundraisingContract.methods.getContribution(1, "testUser2").call();
        expect(contribution.toString()).to.equal('5');
    });

    it('should get all contributions to a project', async () => {
        const contributions = await fundraisingContract.methods.getContributors(1).call();
        expect(contributions).to.be.an('array');
        expect(contributions.length).to.be.above(0);
        expect(contributions[0].username).to.equal('testUser2');
        expect(contributions[0].sum.toString()).to.equal('5');
    });

    it('should generate a project report', async () => {
        const report = await fundraisingContract.methods.getProjectsReport().call();
        expect(report.successfulProjects).to.be.an('array');
        expect(report.failedProjects).to.be.an('array');
    });

    it('should check if project is open', async () => {
        const isOpen = await fundraisingContract.methods.isProjectOpen(1).call();
        expect(isOpen).to.be.true;
    });

    it('should change the project deadline', async () => {
        const timestamp = Math.floor(Date.now() / 1000 - 60 * 60);
        await fundraisingContract.methods.changeDeadline(1, timestamp, "testUser1").send({ from: accounts[0] });
        project = await fundraisingContract.methods.getProject(1).call();

        expect(parseInt(project.deadline)).to.be.equal(timestamp);
    });

    it('should refund all contributors if the project fails', async () => {
        await fundraisingContract.methods.refundAll(1, "testUser1").send({ from: accounts[0] });
        const project = await fundraisingContract.methods.getProject(2).call();
        const userBalance = await web3.eth.getBalance(accounts[1]);

        expect(project.currentAmount.toString()).to.equal('0');
        expect(parseFloat(web3.utils.fromWei(userBalance, 'ether'))).to.be.above(99); // Assuming initial balance was 100 ETH
    });

    it('should allow users to logout', async () => {
        await fundraisingContract.methods.logoutUser("testUser1").send({ from: accounts[0] });
        const user1 = await fundraisingContract.methods.getUser("testUser1").call();

        expect(user1[3]).to.be.false;
    });
});