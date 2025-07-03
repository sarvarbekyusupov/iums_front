import { apiConfig } from "@api/config";
import { ApiUrls } from "@api/api-urls";
import { type SignIn } from "@types";

export const authService = {
    async signIn(model: SignIn, role:string){
        const res = await apiConfig().postRequest(`/${role}_auth${ApiUrls.AUTH}` , model)
        return res
    }
}