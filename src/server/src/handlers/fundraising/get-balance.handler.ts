import { getBalance } from "../../contracts/fundraising/fundraising";

export async function getBalanceHandler(userName: string): Promise<number> {
    try {
        const contractResult = await getBalance(userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return 0;
    }
}