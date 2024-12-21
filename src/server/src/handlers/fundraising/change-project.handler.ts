import { changeProject } from "../../contracts/fundraising/fundraising";
import { ChangeProjectRequest } from "../../models/request/change-project-request.model";

export async function changeProjectHandler(model: ChangeProjectRequest, userName: string): Promise<boolean> {
    try {
        const currentDate = new Date();
        const deadlineDate = new Date(model.deadline);
        const daysDifference = Math.floor((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        const contractResult = await changeProject(model.projectId, model.name, model.description, daysDifference, model.targetAmount, model.isOpen, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}