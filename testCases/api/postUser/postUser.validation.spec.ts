import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onPostUser } from "../../../support/services/postUser";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";
import { onCommonFunctions } from "../../../support/services/common";

test.describe("Post User API business", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let commonDataTest: Record<string, any> = {};
    let headers: Record<string, any> = {};
    let requestBody: Record<string, any> = {};
    let expectedResults: Record<string, any> = {};
    let expectedCommon: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/postUser.json`);
        commonDataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`);
        expectedCommon = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/common.json`);
        expectedResults = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/postUser.json`);
        headers = commonDataTest.headers.contentType.valid;
        requestBody = dataTest.requestBody.valid;
        requestBody.name = dataTest.validName;
        requestBody.email = dataTest.validEmail;
        requestBody.password = dataTest.validPassword;
        requestBody.avatar = dataTest.validAvatar;
    });

    test(
        "DELETE: [/api/v1/users] response [failed] when invalid method",
        { tag: ["@medium", "@functional"] },
        async () => {
            await test.step("Call Post User API with invalid method", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody, true);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.notFound,
                    response,
                    expectedResults.apiRespMsg.failed.invalidMethodAndPath
                );
            });
        }
    );

    test("POST: [/api/v1/users] response [failed] when invalid path", { tag: ["@medium", "@functional"] }, async () => {
        await test.step("Call POST User API with invalid path", async () => {
            response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody, true);
        });

        await test.step("Verify Post User API response", async () => {
            await onCommonFunctions.compareRespMsgWithExpectedFile(
                response.statusCode,
                expectedCommon.httpStatus.failedCode.notFound,
                response,
                expectedResults.apiRespMsg.failed.invalidMethodAndPath
            );
        });
    });

    test(
        "POST: [/api/v1/users] response [failed] when request body is empty",
        { tag: ["@medium", "@functional"] },
        async () => {
            await test.step("Call Post User API with request body is empty", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.internalServerError,
                    response,
                    expectedResults.apiRespMsg.failed.missingFields
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when missing name field",
        { tag: ["@medium", "@functional"] },
        async () => {
            dataTest.requestBody.invalid.missingNameField.email = dataTest.validEmail;
            dataTest.requestBody.invalid.missingNameField.password = dataTest.validPassword;
            dataTest.requestBody.invalid.missingNameField.avatar = dataTest.validAvatar;
            requestBody = dataTest.requestBody.invalid.missingNameField;

            await test.step("Call Post User API with missing name field", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.internalServerError,
                    response,
                    expectedResults.apiRespMsg.failed.missingFields
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when name is empty",
        { tag: ["@medium", "@functional"] },
        async () => {
            requestBody.name = "";
            await test.step("Call Post User API with name is empty", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.nameIsEmpty
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when missing email field",
        { tag: ["@medium", "@functional"] },
        async () => {
            dataTest.requestBody.invalid.missingEmailField.name = dataTest.validName;
            dataTest.requestBody.invalid.missingEmailField.password = dataTest.validPassword;
            dataTest.requestBody.invalid.missingEmailField.avatar = dataTest.validAvatar;
            requestBody = dataTest.requestBody.invalid.missingEmailField;

            await test.step("Call Post User API with missing email field", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.missingEmailFieldOrEmailIsEmpty
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when email is empty",
        { tag: ["@medium", "@functional"] },
        async () => {
            requestBody.email = "";
            await test.step("Call Post User API with email is empty", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });
            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.missingEmailFieldOrEmailIsEmpty
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when email is invalid format",
        { tag: ["@medium", "@functional"] },
        async () => {
            requestBody.email = dataTest.invalidEmailFormat;
            await test.step("Call Post User API with invalid email format", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.invalidEmailFormat
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when missing password field",
        { tag: ["@medium", "@functional"] },
        async () => {
            dataTest.requestBody.invalid.missingPasswordField.name = dataTest.validName;
            dataTest.requestBody.invalid.missingPasswordField.email = dataTest.validEmail;
            dataTest.requestBody.invalid.missingPasswordField.avatar = dataTest.validAvatar;
            requestBody = dataTest.requestBody.invalid.missingPasswordField;

            await test.step("Call Post User API with missing password field", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.missingPasswordFieldOrPasswordIsEmpty
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when password is empty",
        { tag: ["@medium", "@functional"] },
        async () => {
            requestBody.password = "";
            await test.step("Call Post User API with empty password     ", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.missingPasswordFieldOrPasswordIsEmpty
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when password is invalid length",
        { tag: ["@medium", "@functional"] },
        async () => {
            requestBody.password = dataTest.invalidPasswordLength;
            await test.step("Call Post User API with invalid password format", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.invalidPasswordLength
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when password is invalid format",
        { tag: ["@medium", "@functional"] },
        async () => {
            requestBody.password = dataTest.invalidPasswordFormat[0];
            await test.step("Call Post User API with invalid password format", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.invalidPasswordFormat
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when password is invalid length and format",
        { tag: ["@medium", "@functional"] },
        async () => {
            requestBody.password = dataTest.invalidPasswordFormat[1];
            await test.step("Call Post User API with invalid password length and format", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.invalidPasswordFormatAndLength
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when missing avatar field",
        { tag: ["@medium", "@functional"] },
        async () => {
            dataTest.requestBody.invalid.missingAvatarField.name = dataTest.validName;
            dataTest.requestBody.invalid.missingAvatarField.email = dataTest.validEmail;
            dataTest.requestBody.invalid.missingAvatarField.password = dataTest.validPassword;
            requestBody = dataTest.requestBody.invalid.missingAvatarField;
            await test.step("Call Post User API with missing avatar field", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.missingAvatarFieldOrAvatarIsEmpty
                );
            });
        }
    );

    test(
        "POST: [/api/v1/users] response [failed] when avatar is empty",
        { tag: ["@medium", "@functional"] },
        async () => {
            requestBody.avatar = "";
            await test.step("Call Post User API with empty avatar", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.missingAvatarFieldOrAvatarIsEmpty
                );
            });
        }
    );


    test(
        "POST: [/api/v1/users] response [failed] when avatar is invalid format",
        { tag: ["@medium", "@functional"] },
        async () => {
            requestBody.avatar = dataTest.invalidAvatarFormat;
            await test.step("Call Post User API with invalid avatar format", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.badRequest,
                    response,
                    expectedResults.apiRespMsg.failed.invalidAvatarFormat
                );
            });
        }
    );
});
