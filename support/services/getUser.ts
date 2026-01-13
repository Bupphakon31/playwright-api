import { expect } from "@playwright/test";
import { onHTTPRequest } from "../../plugins/httpRequest";  
import { ENV } from "../../globalVariables";

class GetUser{
 public async callGetUser(path:string, params: Record<string,any>={},body: Record<string,any>={}, isCheckMethod = false)
    {
        const options: Record<string, any> = {
            params: params,
            data: body
        };
    const contextHTTP = await onHTTPRequest.createContextHTTPRequest({baseURL: String(ENV.ENV_URL)});
    console.log("Get User API URL: ", String(ENV.ENV_URL) + path);
    let response: Record<string, any> = isCheckMethod 
        ? await contextHTTP.post(path, options) 
        : await contextHTTP.get(path, options);
    response = {
        status: response.status(),
        statusText: response.statusText(),
        body: await response.json()
    };
    await contextHTTP.dispose();
    return response;
    }

    public async verifyUserResponse(response: Record<string, any>){
        expect(response.status).toBe(200);
        if (Array.isArray(response.body)) {
        for (let i = 0; i < response.body.length; i++) {
            expect(response.body[i].id).toEqual(expect.any(Number));
            expect(response.body[i].email).toEqual(expect.any(String));
            expect(response.body[i].password).toEqual(expect.any(String));
            expect(response.body[i].name).toEqual(expect.any(String));
            expect(response.body[i].role).toEqual(expect.any(String));
            expect(response.body[i].avatar).toEqual(expect.any(String));
            expect(response.body[i].creationAt).toEqual(expect.any(String));
            expect(response.body[i].updatedAt).toEqual(expect.any(String));
        }
    } else {
            expect(response.body.id).toEqual(expect.any(Number));
            expect(response.body.email).toEqual(expect.any(String));
            expect(response.body.password).toEqual(expect.any(String));
            expect(response.body.name).toEqual(expect.any(String));
            expect(response.body.role).toEqual(expect.any(String));
            expect(response.body.avatar).toEqual(expect.any(String));
            expect(response.body.creationAt).toEqual(expect.any(String));
            expect(response.body.updatedAt).toEqual(expect.any(String));
        }
    }
}
export const onGetUser: GetUser = new GetUser();