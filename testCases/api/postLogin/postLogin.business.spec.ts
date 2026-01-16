import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onPostLogin } from "../../../support/services/postLogin";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe("Post Login API business", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let commonDataTest: Record<string, any> = {};
    let headers: Record<string, any> = {};
    let requestBody: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/postLogin.json`);
        commonDataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`);
        headers = (await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`)).headers.contentType
            .valid;
        requestBody = (await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/postLogin.json`)).requestBody
            .valid;
        requestBody.email = String(ENV.VALID_EMAIL_JOHN);
        requestBody.password = String(ENV.VALID_PASSWORD_JOHN);
    });

    test(
        "POST: [/api/v1/auth/login] response [success] when login successfully",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step("Call Post Login API with valid request body", async () => {
                response = await onPostLogin.callPostLogin(String(ENV.V1_AUTH_LOGIN), headers, undefined, requestBody);
            });

            await test.step("Verify Post Login API response", async () => {
                await onPostLogin.verifyPostLoginResponse(response);
            });
        }
    );
});
