import { isProjectOpen } from "../../contracts/fundraising/fundraising";

export async function isProjectOpenHandler(projectId: number): Promise<boolean> {
    try {
        const contractResult = await isProjectOpen(projectId);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}