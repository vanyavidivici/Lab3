import { getContribution } from "../../contracts/fundraising/fundraising";

export async function getContributionHandler(projectId: number, userName: string): Promise<number> {
    try {
        const contractResult = await getContribution(projectId, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return 0;
    }
}