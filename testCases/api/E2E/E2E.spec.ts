import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onPostLogin } from "../../../support/services/postLogin";
import { onPostRefreshToken } from "../../../support/services/postRefreshToken";
import { onGetProfile } from "../../../support/services/getProfile";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe("E2E Flow", () => {
    test.describe.configure({ mode: 'serial' });
    
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
        { tag: ["@high", "@regression", "@E2E"] },
        async () => {
            await test.step("Call Post Login API with valid request body", async () => {
                response = await onPostLogin.callPostLogin(String(ENV.V1_AUTH_LOGIN), headers, undefined, requestBody);
            });

            await test.step("Verify Post Login API response", async () => {
                await onPostLogin.verifyPostLoginResponse(response);
            });
        }
    );

    test(
        "POST: [/api/v1/auth/refresh-token] response [success] when generate new refresh token and access token successfully",
        { tag: ["@high", "@regression", "@E2E"] },
        async () => {
            dataTest.requestBody.valid.refreshToken = response.body.refresh_token;
            requestBody = dataTest.requestBody.valid;

            await test.step("Call Post Login API with valid request body", async () => {
                response = await onPostRefreshToken.callPostRefreshToken(
                    String(ENV.V1_AUTH_REFRESH_TOKEN),
                    headers,
                    undefined,
                    requestBody
                );
            });

            await test.step("Verify Post Refresh Token API response", async () => {
                await onPostRefreshToken.verifyPostRefreshTokenResponse(response);
            });
        }
    );

    test(
        "GET: [/api/v1/auth/profile] response [success] when found profile",
        { tag: ["@high", "@regression", "@E2E"] },
        async () => {
            commonDataTest.headers.authAndContentType.authorization = "Bearer " + response.body.access_token;

            await test.step("Call Get Profile API with valid access token", async () => {
                response = await onGetProfile.callGetProfile(
                    String(ENV.V1_AUTH_PROFILE),
                    commonDataTest.headers.authAndContentType
                );
            });

            await test.step("Verify Get Profile API response", async () => {
                await onGetProfile.verifyGetProfileResponse(response);
            });
        }
    );
});
