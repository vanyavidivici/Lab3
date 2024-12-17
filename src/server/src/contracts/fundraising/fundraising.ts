import { Contribution } from "../../models/response/contribution-response.model";
import { ProjectReport, ProjectReportResult } from "../../models/response/projects-report-response.model";

const Web3Lib = require('web3');
const { abi, bytecode } = require('./../../../../smart-contract/scripts/compile.js');

let accounts;
let userImageStore;
let contract: any;

const web3 = new Web3Lib.Web3('http://127.0.0.1:8545');

let fromAddress: string;

export async function buildClient() {
    await deployContract();
    const contractAddress = userImageStore!.options.address;
    contract = new web3.eth.Contract(abi, contractAddress);
    fromAddress = accounts![0];
}

async function deployContract() {
    accounts = await web3.eth.getAccounts();
    userImageStore = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: 30000000 });
}

//#region auth

export async function registerUser(login: string, password: string): Promise<boolean> {
    try {
        await contract.methods.registerUser(login, password).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

export async function loginUser(login: string, password: string): Promise<boolean> {
    try {
        await contract.methods.loginUser(login, password).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

export async function logoutUser(login: string): Promise<void> {
    try {
        await contract.methods.logoutUser(login).send({ from: fromAddress });
    }
    catch (error) {
        console.error(error);
    }
}

//#endregion


//#region fundraising

export async function createProject(name: string, goalAmount: number, durationInDays: number, login: string): Promise<boolean> {
    try {
        await contract.methods.createProject(name, goalAmount, durationInDays, login).send({ from: fromAddress });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function contributeToProject(projectId: number, login: string, amount: number): Promise<boolean> {
    try {
        await contract.methods.contributeToProject(projectId, login).send({ from: fromAddress, value: web3.utils.toWei(amount.toString(), 'ether') });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function refundAll(projectId: number, login: string): Promise<boolean> {
    try {
        await contract.methods.refundAll(projectId, login).send({ from: fromAddress });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function changeDeadline(projectId: number, additionalDays: number, login: string): Promise<boolean> {
    try {
        await contract.methods.changeDeadline(projectId, additionalDays, login).send({ from: fromAddress });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getContribution(projectId: number, login: string): Promise<number> {
    try {
        const contribution = await contract.methods.getContribution(projectId, login).call();
        return contribution;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

export async function getContributors(projectId: number): Promise<Contribution[]> {
    try {
        const result = await contract.methods.getContributors(projectId).call();
        return result.map((contribution: { username: string, sum: string }) => ({
            username: contribution.username,
            sum: parseFloat(contribution.sum)
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function isProjectOpen(projectId: number): Promise<boolean> {
    try {
        const isOpen = await contract.methods.isProjectOpen(projectId).call();
        return isOpen;
    } catch (error) {
        console.error(error);
        return false;
    }
}

//generate function for getting all open projects from function getOpenProjects
export async function getOpenProjects(): Promise<ProjectReport[]> {
    try {
        const result = await contract.methods.getOpenProjects().call();
        return result.map((project: { name: string, goalAmount: string, receivedAmount: string, deadline: string }) => ({
            name: project.name,
            goalAmount: parseFloat(project.goalAmount),
            receivedAmount: parseFloat(project.receivedAmount),
            deadline: parseInt(project.deadline)
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProjectsReport(): Promise<ProjectReportResult> {
    try {
        const result = await contract.methods.getProjectsReport().call();
        return {
            successfulProjects: result[0].map((project: { name: string, goalAmount: string, receivedAmount: string, deadline: string }) => ({
                name: project.name,
                goalAmount: parseFloat(project.goalAmount),
                receivedAmount: parseFloat(project.receivedAmount),
                deadline: parseInt(project.deadline)
            })),
            failedProjects: result[1].map((project: { name: string, goalAmount: string, receivedAmount: string, deadline: string }) => ({
                name: project.name,
                goalAmount: parseFloat(project.goalAmount),
                receivedAmount: parseFloat(project.receivedAmount),
                deadline: parseInt(project.deadline)
            }))
        };
    } catch (error) {
        console.error(error);
        return { successfulProjects: [], failedProjects: [] };
    }
}

//#endregion
