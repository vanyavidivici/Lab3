import { ChangeProjectDeadlineRequest } from "../../models/request/change-project-deadline-request.model";
import { changeDeadline } from "../../contracts/fundraising/fundraising";

export async function changeProjectDeadlineHandler(model: ChangeProjectDeadlineRequest, userName: string): Promise<boolean> {
    try {
        const deadlineDate = new Date(model.newDeadline);
        const timestamp = Math.floor(deadlineDate.getTime() / 1000);
        const contractResult = await changeDeadline(model.projectId, timestamp, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}