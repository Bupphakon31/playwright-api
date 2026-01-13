import { request } from "@playwright/test";

class HttpRequest {
    public async createContextHTTPRequest(options: Record<string, any>) {
        return await request.newContext({
            ...options,
            ...{ failOnStatusCode: false, ignoreHTTPSErrors: true },
        });
    }
}

export const onHTTPRequest: HttpRequest = new HttpRequest();
