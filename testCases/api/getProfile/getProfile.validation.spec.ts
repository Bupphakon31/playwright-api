import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onGetProfile } from "../../../support/services/getProfile";
import { onPostLogin } from "../../../support/services/postLogin";
import { onCommonFunctions } from "../../../support/services/common";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe("Get Profile validation", () => {
    let response: Record<string, any> = {};
    let responseLogin: Record<string, any> = {};
    let headers: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let commonDataTest: Record<string, any> = {};
    let expectedCommon: Record<string, any> = {};
    let expectedResults: Record<string, any> = {};
    let requestBodyLogin: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/getProfile.json`);
        commonDataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`);
        expectedCommon = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/common.json`);
        expectedResults = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/getProfile.json`);
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
        "PATCH: [/api/v1/auth/profile] response [failed] when invalid method",
        { tag: ["@high", "@functional"] },
        async () => {
            commonDataTest.headers.authAndContentType.authorization = "Bearer " + responseLogin.body.access_token;

            await test.step("Call Get Profile API with invalid method", async () => {
                response = await onGetProfile.callGetProfile(
                    String(ENV.V1_AUTH_PROFILE),
                    commonDataTest.headers.authAndContentType,
                    undefined,
                    undefined,
                    true
                );
            });

            await test.step("Verify Get Profile API response", async () => {
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
        "GET: [/api/v1/auth/profile] response [failed] when invalid path",
        { tag: ["@high", "@functional"] },
        async () => {
            commonDataTest.headers.authAndContentType.authorization = "Bearer " + responseLogin.body.access_token;

            await test.step("Call Get Profile API with invalid path", async () => {
                response = await onGetProfile.callGetProfile(
                    dataTest.invalidPath,
                    commonDataTest.headers.authAndContentType
                );
            });

            await test.step("Verify Get Profile API response", async () => {
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
        "GET: [/api/v1/auth/profile] response [failed] when authorization is empty or null",
        { tag: ["@high", "@functional"] },
        async () => {
            const invalidData = ['""', null];
            for (const dataTest of invalidData) {
                commonDataTest.headers.authAndContentType.authorization = "Bearer " + dataTest;

                await test.step("Call Get Profile API with authorization is empty or null", async () => {
                    response = await onGetProfile.callGetProfile(
                        String(ENV.V1_AUTH_PROFILE),
                        commonDataTest.headers.authAndContentType
                    );
                });

                await test.step("Verify Get Profile API response", async () => {
                    await onCommonFunctions.compareRespMsgWithExpectedFile(
                        response.statusCode,
                        expectedCommon.httpStatus.failedCode.unauthorized,
                        response,
                        expectedCommon.apiRespMsg.failed.unauthorized
                    );
                });
            }
        }
    );

    test(
        "GET: [/api/v1/auth/profile] response [failed] when invalid access token",
        { tag: ["@high", "@functional"] },
        async () => {
            commonDataTest.headers.authAndContentType.authorization = "Bearer " + dataTest.invalidAccessToken;

            await test.step("Call Get Profile API with invalid access token", async () => {
                response = await onGetProfile.callGetProfile(
                    String(ENV.V1_AUTH_PROFILE),
                    commonDataTest.headers.authAndContentType
                );
            });

            await test.step("Verify Get Profile API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.unauthorized,
                    response,
                    expectedCommon.apiRespMsg.failed.unauthorized
                );
            });
        }
    );

    test(
        "GET: [/api/v1/auth/profile] response [success] when unexpected param",
        { tag: ["@high", "@functional"] },
        async () => {
            commonDataTest.headers.authAndContentType.authorization = "Bearer " + responseLogin.body.access_token;

            await test.step("Call Get Profile API with unexpected param", async () => {
                response = await onGetProfile.callGetProfile(
                    String(ENV.V1_AUTH_PROFILE),
                    commonDataTest.headers.authAndContentType,
                    commonDataTest.unexpectedParam
                );
            });

            await test.step("Verify Get Profile API response", async () => {
                await onGetProfile.verifyGetProfileResponse(response);
            });
        }
    );

    test(
        "GET: [/api/v1/auth/profile] response [success] when unexpected request body",
        { tag: ["@high", "@functional"] },
        async () => {
            commonDataTest.headers.authAndContentType.authorization = "Bearer " + responseLogin.body.access_token;

            await test.step("Call Get Profile API with unexpected request body", async () => {
                response = await onGetProfile.callGetProfile(
                    String(ENV.V1_AUTH_PROFILE),
                    commonDataTest.headers.authAndContentType,
                    undefined,
                    commonDataTest.unexpectedBody
                );
            });

            await test.step("Verify Get Profile API response", async () => {
                await onGetProfile.verifyGetProfileResponse(response);
            });
        }
    );
});
