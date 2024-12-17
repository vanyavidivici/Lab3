import { contributeToProject } from "../../contracts/fundraising/fundraising";
import { ContributeRequest } from "../../models/request/contribute-request.model";

export async function contributeHandle(model: ContributeRequest, userName: string): Promise<boolean> {
    try {
        const contractResult = await contributeToProject(model.projectId, userName, model.amount);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}