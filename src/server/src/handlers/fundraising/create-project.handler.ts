import { CreateProjectRequest } from "../../models/request/create-project-request.model";
import { createProject } from "../../contracts/fundraising/fundraising";

export async function createProjectHandler(model: CreateProjectRequest, userName: string): Promise<number> {
    try {
        const deadlineDate = new Date(model.deadline);
        const timestamp = Math.floor(deadlineDate.getTime() / 1000);
        const contractResult = await createProject(model.name, model.description, model.targetAmount, timestamp, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return 0;
    }
}