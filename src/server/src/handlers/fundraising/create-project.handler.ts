import { CreateProjectRequest } from "../../models/request/create-project-request.model";
import { createProject } from "../../contracts/fundraising/fundraising";

export async function createProjectHandler(model: CreateProjectRequest, userName: string): Promise<number> {
    try {
        console.log(model);
        const currentDate = new Date();
        const deadlineDate = new Date(model.deadline);
        const daysDifference = Math.floor((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        const contractResult = await createProject(model.name, model.description, daysDifference, model.targetAmount, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return 0;
    }
}