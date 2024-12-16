import { logoutUser } from "../../contracts/fundraising/fundraising";

export async function logout(username: string): Promise<void> {
    await logoutUser(username);    
}