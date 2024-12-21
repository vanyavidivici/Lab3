import { getProject } from "../../contracts/fundraising/fundraising";
import { Project } from "../../models/response/project-response.model";

export async function getProjectHandler(projectId: number): Promise<Project> {
    try {
        const contractResult = await getProject(projectId);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return { name: "", description: "", goalAmount: 0, deadline: 0, isOpen: false };
    }
}