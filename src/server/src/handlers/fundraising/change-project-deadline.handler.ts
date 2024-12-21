import { ChangeProjectDeadlineRequest } from "../../models/request/change-project-deadline-request.model";
import { changeDeadline } from "../../contracts/fundraising/fundraising";

export async function changeProjectDeadlineHandler(model: ChangeProjectDeadlineRequest, userName: string): Promise<boolean> {
    try {
        const contractResult = await changeDeadline(model.projectId, model.additionalDays, userName);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}