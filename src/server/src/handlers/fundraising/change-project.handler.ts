import { changeProject } from "../../contracts/fundraising/fundraising";
import { ChangeProjectRequest } from "../../models/request/change-project-request.model";

export async function changeProjectHandler(model: ChangeProjectRequest, userName: string): Promise<boolean> {
    try {
        const deadlineDate = new Date(model.deadline);
        const timestamp = Math.floor(deadlineDate.getTime() / 1000);
        const contractResult = await changeProject(model.projectId, model.name, model.description, timestamp, model.targetAmount, model.isOpen, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}