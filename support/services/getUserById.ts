import { expect } from "@playwright/test";
import { onHTTPRequest } from "../../plugins/httpRequest";
import { ENV } from "../../globalVariables";

class GetUserById {

    public async callGetUserById(
        path: string,
        userId: string | any,
        params: Record<string, any> = {},
        body: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = {
            params: params,
            data: body,
        };

        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: String(ENV.ENV_URL) });
        let response: Record<string, any> = isCheckMethod
            ? await contextHTTP.post(path.replace("{{:userId}}", userId), options)
            : await contextHTTP.get(path.replace("{{:userId}}", userId), options);
        response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };

        await contextHTTP.dispose();
        return response;
    }

}

export const onGetUserById: GetUserById = new GetUserById();
