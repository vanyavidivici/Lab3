import { getProjectsByUsername } from '../../contracts/fundraising/fundraising';
import { Project } from '../../models/response/project-response.model';
import { ProjectReport } from '../../models/response/projects-report-response.model';

export async function getMyProjectsHandler(username: string): Promise<ProjectReport[]> {
    try {
        const projects = await getProjectsByUsername(username);
        return projects;
    } catch (error) {
        console.error(error);
        return [];
    }
}