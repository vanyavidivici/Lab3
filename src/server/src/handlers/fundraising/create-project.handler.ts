import { CreateProjectRequest } from "../../models/request/create-project-request.model";
import { createProject } from "../../contracts/fundraising/fundraising";

export async function createProjectHandle(model: CreateProjectRequest, userName: string): Promise<boolean> {
    // in model request i get the date. calculate please the days difference between current date and the date from the model
    // and pass it to the createProject function
    try {
        const currentDate = new Date();
        const deadlineDate = new Date(model.deadline); // Ensure deadline is a Date object
        const daysDifference = Math.floor((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        const contractResult = await createProject(model.name, daysDifference, model.targetAmount, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}