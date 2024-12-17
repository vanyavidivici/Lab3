import { getContributors } from "../../contracts/fundraising/fundraising";
import { Contributor } from "../../models/response/contributors.model";

export async function getContributorsHandler(projectId: number): Promise<Contributor[]> {
    try {
        const contractResult = await getContributors(projectId);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}