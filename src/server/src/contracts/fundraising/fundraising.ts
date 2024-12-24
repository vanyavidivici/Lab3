import { Contribution } from "../../models/response/contribution-response.model";
import { Project } from "../../models/response/project-response.model";
import { ProjectReport, ProjectReportResult } from "../../models/response/projects-report-response.model";

const Web3Lib = require('web3');
const { abi, bytecode } = require('./../../../../smart-contract/scripts/compile.js');

let accounts;
let fundraisingContract;
let contract: any;

const web3 = new Web3Lib.Web3('http://127.0.0.1:8545');

let fromAddress: string;

export async function buildClient() {
    await deployContract();
    const contractAddress = fundraisingContract!.options.address;
    contract = new web3.eth.Contract(abi, contractAddress);
    fromAddress = accounts![0];
}

async function deployContract() {
    accounts = await web3.eth.getAccounts();
    fundraisingContract = await new web3.eth.Contract(abi)
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

export async function createProject(name: string, description: string, goalAmount: number, durationInDays: number, login: string): Promise<number> {
    try {
        const result = await contract.methods.createProject(name, description, goalAmount, durationInDays, login).send({ from: fromAddress });
        const projectId = result.events.ProjectCreated.returnValues.projectId;
        return Number(projectId); // Convert BigInt to number
    } catch (error) {
        console.error(error);
        return 0;
    }
}

export async function getProject(projectId: number): Promise<Project> {
    try {
        const result = await contract.methods.getProjectReport(projectId).call();
        return {
            projectId: parseInt(result.projectId),
            name: result.name,
            description: result.description,
            goalAmount: parseFloat(result.goalAmount),
            deadline: parseInt(result.deadline),
            isOpen: result.isOpen
        };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get project');
    }
}

export async function changeProject(projectId: number, name: string, description: string, goalAmount: number, durationInDays: number, isOpen: boolean, login: string): Promise<boolean> {
    try {
        const result = await contract.methods.changeProject(projectId, name, description, goalAmount, durationInDays, isOpen, login).send({ from: fromAddress });
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function deleteProject(projectId: number, login: string): Promise<boolean> {
    try {
        await contract.methods.deleteProject(projectId, login).send({ from: fromAddress });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function contributeToProject(projectId: number, login: string, amount: number): Promise<boolean> {
    try {
        await contract.methods.contributeToProject(projectId, amount, login).send({ from: fromAddress/*, value: web3.utils.toWei(amount.toString(), 'ether')*/ });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getBalance(username: string): Promise<number> {
    try {
        const balance = await contract.methods.getUserBalance(username).call({ from: fromAddress });
        console.log(balance);
        return parseFloat(balance);
    } catch (error) {
        console.error(error);
        return 0;
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

export async function changeDeadline(projectId: number, newDeadline: number, login: string): Promise<boolean> {
    try {
        await contract.methods.changeDeadline(projectId, newDeadline, login).send({ from: fromAddress });
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

export async function getProjectsByUsername(username: string): Promise<ProjectReport[]> {
    try {
        const result = await contract.methods.getProjectsByUsername(username).call();
        console.log(result);
        return result.map((project: { projectId: string, name: string, description: string, goalAmount: bigint, receivedAmount: bigint, deadline: string, isOpen: boolean }) => ({
            projectId: parseInt(project.projectId),
            name: project.name,
            description: project.description,
            goalAmount: Number(project.goalAmount.toString()),
            receivedAmount: Number(project.receivedAmount.toString()),
            deadline: parseInt(project.deadline),
            isOpen: project.isOpen
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getOpenProjects(): Promise<ProjectReport[]> {
    try {
        const result = await contract.methods.getOpenProjects().call();
        return result.map((project: { projectId: string, name: string, description: string, goalAmount: string, receivedAmount: string, deadline: string, isOpen: boolean }) => ({
            projectId: parseInt(project.projectId),
            name: project.name,
            description: project.description,
            goalAmount: parseFloat(project.goalAmount),
            receivedAmount: parseFloat(project.receivedAmount),
            deadline: parseInt(project.deadline),
            isOpen: project.isOpen
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
            successfulProjects: result[0].map((project: { name: string, description: string, goalAmount: string, receivedAmount: string, deadline: string, isOpen: boolean }) => ({
                name: project.name,
                description: project.description,
                goalAmount: parseFloat(project.goalAmount),
                receivedAmount: parseFloat(project.receivedAmount),
                deadline: parseInt(project.deadline),
                isOpen: project.isOpen
            })),
            failedProjects: result[1].map((project: { name: string, description: string, goalAmount: string, receivedAmount: string, deadline: string, isOpen: boolean}) => ({
                name: project.name,
                description: project.description,
                goalAmount: parseFloat(project.goalAmount),
                receivedAmount: parseFloat(project.receivedAmount),
                deadline: parseInt(project.deadline),
                isOpen: project.isOpen
            }))
        };
    } catch (error) {
        console.error(error);
        return { successfulProjects: [], failedProjects: [] };
    }
}

//#endregion
