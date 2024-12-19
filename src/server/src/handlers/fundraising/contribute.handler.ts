import { contributeToProject, getBalance } from "../../contracts/fundraising/fundraising";
import { ContributeRequest } from "../../models/request/contribute-request.model";

export async function contributeHandle(model: ContributeRequest, userName: string): Promise<number> {
    try {
        const contractResult = await contributeToProject(model.projectId, userName, model.amount);
        const balance = await getBalance(userName);
        return balance;
    }
    catch (error) {
        console.error(error);
        return 0;
    }
}