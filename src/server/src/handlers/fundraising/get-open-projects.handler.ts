import { getOpenProjects } from "../../contracts/fundraising/fundraising";
import { ProjectReport } from "../../models/response/projects-report-response.model";

export async function getOpenProjectsHandler(): Promise<ProjectReport[]> {
    try {
        const contractResult = await getOpenProjects();
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}