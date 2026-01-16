import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onPostRefreshToken } from "../../../support/services/postRefreshToken";
import { onPostLogin } from "../../../support/services/postLogin";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";
import { onCommonFunctions } from "../../../support/services/common";

test.describe("Post Refresh Token API business", () => {
    let response: Record<string, any> = {};
    let responseLogin: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let commonDataTest: Record<string, any> = {};
    let headers: Record<string, any> = {};
    let requestBodyLogin: Record<string, any> = {};
    let requestBody: Record<string, any> = {};
    let expectedResults: Record<string, any> = {};
    let expectedCommon: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/postRefreshToken.json`);
        commonDataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`);
        expectedResults = await onFileExtensionUtil.readDataFromJson(
            `./resources/expectedResults/postRefreshToken.json`
        );
        expectedCommon = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/common.json`);
        headers = (await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`)).headers.contentType
            .valid;
        requestBodyLogin = (await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/postLogin.json`))
            .requestBody.valid;
        requestBodyLogin.email = String(ENV.VALID_EMAIL_JOHN);
        requestBodyLogin.password = String(ENV.VALID_PASSWORD_JOHN);
        responseLogin = await onPostLogin.callPostLogin(
            String(ENV.V1_AUTH_LOGIN),
            headers,
            undefined,
            requestBodyLogin
        );
    });

    test(
        "POST: [/api/v1/auth/refresh-token] response [success] when generate new refresh token and access token successfully",
        { tag: ["@high", "@regression"] },
        async () => {
            dataTest.requestBody.valid.refreshToken = responseLogin.body.refresh_token;
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
        "POST: [/api/v1/auth/refresh-token] response [failed] when refresh token is expired",
        { tag: ["@high", "@regression"] },
        async () => {
            dataTest.requestBody.valid.refreshToken = dataTest.expiredRefreshToken;
            requestBody = dataTest.requestBody.valid;

            await test.step("Call Post Login API with refresh token is expired", async () => {
                response = await onPostRefreshToken.callPostRefreshToken(
                    String(ENV.V1_AUTH_REFRESH_TOKEN),
                    headers,
                    undefined,
                    requestBody
                );
            });

            await test.step("Verify Post Refresh Token API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.unauthorized,
                    response,
                    expectedResults.apiRespMsg.failed.invalidRefreshToken
                );
            });
        }
    );
});
