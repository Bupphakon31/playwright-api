import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onPostLogin } from "../../../support/services/postLogin";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";
import { onCommonFunctions } from "../../../support/services/common";

test.describe("Post Login API validation", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let commonDataTest: Record<string, any> = {};
    let headers: Record<string, any> = {};
    let requestBody: Record<string, any> = {};
    let expectedCommon: Record<string, any> = {};
    let expectedResults: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/postLogin.json`);
        commonDataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`);
        expectedCommon = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/common.json`);
        expectedResults = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/postLogin.json`);
        headers = (await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`)).headers.contentType
            .valid;
        requestBody = (await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/postLogin.json`)).requestBody
            .valid;
        requestBody.email = String(ENV.VALID_EMAIL_JOHN);
        requestBody.password = String(ENV.VALID_PASSWORD_JOHN);
    });

    test(
        "POST: [/api/v1/auth/login] response [failed] when invalid method",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Post Login API with invalid method", async () => {
                response = await onPostLogin.callPostLogin(
                    String(ENV.V1_AUTH_LOGIN),
                    headers,
                    undefined,
                    requestBody,
                    true
                );
            });

            await test.step("Verify Post Login API response", async () => {
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
            await test.step("Call Post Login API with invalid path", async () => {
                response = await onPostLogin.callPostLogin(dataTest.invalidPath, headers, undefined, requestBody);
            });

            await test.step("Verify Post Login API response", async () => {
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
        "POST: [/api/v1/auth/login] response [failed] when missing email field",
        { tag: ["@high", "@functional"] },
        async () => {
            dataTest.requestBody.invalid.missingEmailField.password = String(ENV.VALID_PASSWORD_JOHN);
            requestBody = dataTest.requestBody.invalid.missingEmailField;

            await test.step("Call Post Login API with missing email field", async () => {
                response = await onPostLogin.callPostLogin(String(ENV.V1_AUTH_LOGIN), headers, undefined, requestBody);
            });

            await test.step("Verify Post Login API response", async () => {
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
        "POST: [/api/v1/auth/login] response [failed] when missing password field",
        { tag: ["@high", "@functional"] },
        async () => {
            dataTest.requestBody.invalid.missingPasswordField.email = String(ENV.VALID_EMAIL_JOHN);
            requestBody = dataTest.requestBody.invalid.missingPasswordField;

            await test.step("Call Post Login API with missing password field", async () => {
                response = await onPostLogin.callPostLogin(String(ENV.V1_AUTH_LOGIN), headers, undefined, requestBody);
            });

            await test.step("Verify Post Login API response", async () => {
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
        "POST: [/api/v1/auth/login] response [failed] when missing email and password field",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Post Login API with missing email and password field", async () => {
                response = await onPostLogin.callPostLogin(String(ENV.V1_AUTH_LOGIN), headers);
            });

            await test.step("Verify Post Login API response", async () => {
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
        "POST: [/api/v1/auth/login] response [failed] when invalid email",
        { tag: ["@high", "@functional"] },
        async () => {
            requestBody.email = dataTest.invalidEmail;

            await test.step("Call Post Login API with invalid email", async () => {
                response = await onPostLogin.callPostLogin(String(ENV.V1_AUTH_LOGIN), headers);
            });

            await test.step("Verify Post Login API response", async () => {
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
        "POST: [/api/v1/auth/login] response [failed] when invalid password",
        { tag: ["@high", "@functional"] },
        async () => {
            requestBody.password = dataTest.invalidPassword;

            await test.step("Call Post Login API with invalid email", async () => {
                response = await onPostLogin.callPostLogin(String(ENV.V1_AUTH_LOGIN), headers);
            });

            await test.step("Verify Post Login API response", async () => {
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
        "POST: [/api/v1/auth/login] response [failed] when invalid email and password",
        { tag: ["@high", "@functional"] },
        async () => {
            requestBody.email = dataTest.invalidEmail;
            requestBody.password = dataTest.invalidPassword;

            await test.step("Call Post Login API with invalid email and password", async () => {
                response = await onPostLogin.callPostLogin(String(ENV.V1_AUTH_LOGIN), headers);
            });

            await test.step("Verify Post Login API response", async () => {
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
        "POST: [/api/v1/auth/login] response [failed] when unexpected request body",
        { tag: ["@high", "@functional"] },
        async () => {
            dataTest.requestBody.unexpectedBody.email = String(ENV.VALID_EMAIL_JOHN);
            dataTest.requestBody.unexpectedBody.password = String(ENV.VALID_PASSWORD_JOHN);
            requestBody = dataTest.requestBody.unexpectedBody;

            await test.step("Call Post Login API with unexpected request body", async () => {
                response = await onPostLogin.callPostLogin(String(ENV.V1_AUTH_LOGIN), headers, undefined, requestBody);
            });

            await test.step("Verify Post Login API response", async () => {
                await onPostLogin.verifyPostLoginResponse(response);
            });
        }
    );

    test(
        "POST: [/api/v1/auth/login] response [failed] when unexpected params",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Post Login API with unexpected params", async () => {
                response = await onPostLogin.callPostLogin(
                    String(ENV.V1_AUTH_LOGIN),
                    headers,
                    commonDataTest.unexpectedParam,
                    requestBody
                );
            });

            await test.step("Verify Post Login API response", async () => {
                await onPostLogin.verifyPostLoginResponse(response);
            });
        }
    );
});
