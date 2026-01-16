import { expect } from "@playwright/test";
import { onHTTPRequest } from "../../plugins/httpRequest";
import { ENV } from "../../globalVariables";

class GetProfile {
    public async callGetProfile(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        body: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = {
            headers: headers,
            params: params,
            data: body,
        };

        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: String(ENV.ENV_URL) });
        let response: Record<string, any> = isCheckMethod
            ? await contextHTTP.patch(path, options)
            : await contextHTTP.get(path, options);
        response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };

        await contextHTTP.dispose();
        return response;
    }

    public async verifyGetProfileResponse(response: Record<string, any>) {
        expect(response.statusCode).toBe(200);
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

export const onGetProfile: GetProfile = new GetProfile();
