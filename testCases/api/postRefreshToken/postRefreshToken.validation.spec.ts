import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onPostRefreshToken } from "../../../support/services/postRefreshToken";
import { onPostLogin } from "../../../support/services/postLogin";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";
import { onCommonFunctions } from "../../../support/services/common";

test.describe("Post Refresh Token API validation", () => {
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
        "DELETE: [/api/v1/auth/refresh-token] response [failed] when invalid method",
        { tag: ["@high", "@functional"] },
        async () => {
            dataTest.requestBody.valid.refreshToken = responseLogin.body.refresh_token;
            requestBody = dataTest.requestBody.valid;

            await test.step("Call Post Login API with invalid method", async () => {
                response = await onPostRefreshToken.callPostRefreshToken(
                    String(ENV.V1_AUTH_REFRESH_TOKEN),
                    headers,
                    undefined,
                    requestBody,
                    true
                );
            });

            await test.step("Verify Post Refresh Token API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.notFound,
                    response,
                    expectedResults.apiRespMsg.failed.invalidMethod
                );
            });
        }
    );

    test(
        "POST: [/api/v1/auth/login] response [failed] when invalid path",
        { tag: ["@high", "@functional"] },
        async () => {
            dataTest.requestBody.valid.refreshToken = dataTest.expiredRefreshToken;
            requestBody = dataTest.requestBody.valid;

            await test.step("Call Post Login API with invalid path", async () => {
                response = await onPostRefreshToken.callPostRefreshToken(
                    dataTest.invalidPath,
                    headers,
                    undefined,
                    requestBody
                );
            });

            await test.step("Verify Post Refresh Token API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.notFound,
                    response,
                    expectedResults.apiRespMsg.failed.invalidPath
                );
            });
        }
    );

    test(
        "POST: [/api/v1/auth/login] response [failed] when refresh token is empty",
        { tag: ["@high", "@functional"] },
        async () => {
            dataTest.requestBody.valid.refreshToken = "";
            requestBody = dataTest.requestBody.valid;

            await test.step("Call Post Login API with refresh token is empty", async () => {
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
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.refreshTokenIsEmpty
                );
            });
        }
    );

    test(
        "POST: [/api/v1/auth/login] response [failed] when missing refresh token field",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Post Login API with missing refresh token field", async () => {
                response = await onPostRefreshToken.callPostRefreshToken(String(ENV.V1_AUTH_REFRESH_TOKEN), headers);
            });

            await test.step("Verify Post Refresh Token API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.missingRefreshTokenField
                );
            });
        }
    );

    test(
        "POST: [/api/v1/auth/login] response [failed] when invalid refresh token format",
        { tag: ["@high", "@functional"] },
        async () => {
            dataTest.requestBody.valid.refreshToken = dataTest.invalidRefreshTokenFormat;
            requestBody = dataTest.requestBody.valid;

            await test.step("Call Post Login API with invalid refresh token format", async () => {
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

    test(
        "POST: [/api/v1/auth/login] response [success] when unexpected request body",
        { tag: ["@high", "@functional"] },
        async () => {
            dataTest.requestBody.unexpectedBody.refreshToken = responseLogin.body.refresh_token;
            requestBody = dataTest.requestBody.unexpectedBody;

            await test.step("Call Post Login API with unexpected request body", async () => {
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
        "POST: [/api/v1/auth/login] response [success] when unexpected param",
        { tag: ["@high", "@functional"] },
        async () => {
            dataTest.requestBody.valid.refreshToken = responseLogin.body.refresh_token;
            requestBody = dataTest.requestBody.valid;

            await test.step("Call Post Login API with unexpected param", async () => {
                response = await onPostRefreshToken.callPostRefreshToken(
                    String(ENV.V1_AUTH_REFRESH_TOKEN),
                    headers,
                    commonDataTest.unexpectedParam,
                    requestBody
                );
            });

            await test.step("Verify Post Refresh Token API response", async () => {
                await onPostRefreshToken.verifyPostRefreshTokenResponse(response);
            });
        }
    );
});
