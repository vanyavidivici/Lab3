import { refundAll } from "../../contracts/fundraising/fundraising";

export async function refundHandler(projectId: number, userName: string): Promise<boolean> {
    try {
        const contractResult = await refundAll(projectId, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}