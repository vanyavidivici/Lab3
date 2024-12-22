import { getProjectsByUsername } from '../../contracts/fundraising/fundraising';
import { Project } from '../../models/response/project-response.model';

export async function getMyProjectsHandler(username: string): Promise<Project[]> {
    try {
        const projects = await getProjectsByUsername(username);
        return projects;
    } catch (error) {
        console.error(error);
        return [];
    }
}