import { deleteProject } from "../../contracts/fundraising/fundraising";

export async function deleteProjectHandler(projectId: number, userName: string): Promise<boolean> {
    try {
        const contractResult = await deleteProject(projectId, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}