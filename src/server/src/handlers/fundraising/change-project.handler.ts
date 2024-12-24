import { changeProject } from "../../contracts/fundraising/fundraising";
import { ChangeProjectRequest } from "../../models/request/change-project-request.model";

export async function changeProjectHandler(model: ChangeProjectRequest, userName: string): Promise<boolean> {
    try {
        console.log(model);
        const deadlineDate = new Date(model.deadline);
        const timestamp = Math.floor(deadlineDate.getTime() / 1000);
        const contractResult = await changeProject(model.projectId, model.name, model.description, model.targetAmount, timestamp, model.isOpen, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}