import { expect } from "@playwright/test";
import { onHTTPRequest } from "../../plugins/httpRequest";
import { ENV } from "../../globalVariables";

class PostRefreshToken {
    public async callPostRefreshToken(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        body: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = {
            params: params,
            headers: headers,
            data: body,
        };

        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: String(ENV.ENV_URL) });
        let response: Record<string, any> = isCheckMethod
            ? await contextHTTP.delete(path, options)
            : await contextHTTP.post(path, options);
        response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };

        await contextHTTP.dispose();
        return response;
    }

    public async verifyPostRefreshTokenResponse(response: Record<string, any>) {
        expect(response.statusCode).toBe(201);
        expect(response.body.access_token).toEqual(expect.any(String));
        expect(response.body.refresh_token).toEqual(expect.any(String));
    }
}

export const onPostRefreshToken: PostRefreshToken = new PostRefreshToken();
