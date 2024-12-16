import { loginUser } from "../../contracts/fundraising/fundraising";
import { createJwtToken } from "../../routers/jwt-utils/jwt-helper";
import { BaseResponseModel } from "../../models/base-response.model";
import { AuthRequestModel } from "../../models/request/auth-request.model";
import { AuthResponseModel } from "../../models/response/auth-reponse.model";

export async function login(model: AuthRequestModel): Promise<BaseResponseModel<AuthResponseModel>> {
    const authResult = await loginUser(model.username, model.password);
    if(!authResult){
        return {
            data: null,
            isSuccess: false,
            message: "Invalid login"
        }
    }

    const token = createJwtToken({ username: model.username });
    const res =  {
        data: {
            accessToken: token
        },
        isSuccess: true,
        message: null
    }

    return res;    
}