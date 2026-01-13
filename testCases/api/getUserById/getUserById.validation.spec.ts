import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onGetUser } from "../../../support/services/getUser";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";
import { onCommonFunctions } from "../../../support/services/common";

test.describe.only("Get User API business", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let expectedResults: Record<string, any> = {};
    let expectedCommon: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/getUser.json`);
        expectedCommon = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/common.json`);
        expectedResults = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/getUser.json`);
    });

    test(
        "POST: [/api/v1/users/{userId}] response [failed] when invalid method",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call POST User by ID API with valid userId format", async () => {
                response = await onGetUser.callGetUser(
                    `${String(ENV.V1_USER)}/${dataTest.userId[0]}`,
                    undefined,
                    undefined,
                    true
                );
            });

            await test.step("Verify Get User by ID API response", async () => {
                console.log("Response Body: ", response.body);
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.notFound,
                    response,
                    expectedResults.apiRespMsg.failed.notFoundUserId
                );
            });
        }
    );

    test(
        "GET: [/api/v1/users/{userId}] response [success] when not send userId",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Get User by ID API with not send userId", async () => {
                response = await onGetUser.callGetUser(String(ENV.V1_USER));
            });

            await test.step("Verify Get User by ID API response", async () => {
                console.log("Response Body: ", response.body);
                await onGetUser.verifyUserResponse(response);
            });
        }
    );

    test(
        "GET: [/api/v1/users/{userId}] response [failed] when invalid userId format",
        { tag: ["@high", "@functional"] },
        async () => {
            for (let i = 0; i < dataTest.invalidUserId.length; i++) {
                const userId = dataTest.invalidUserId[i];

                await test.step("Call Get User by ID API with invalid userId format", async () => {
                    response = await onGetUser.callGetUser(`${String(ENV.V1_USER)}/${userId}`);
                });

                await test.step("Verify Get User by ID API response", async () => {
                    console.log("Response Body: ", response.body);
                    await onCommonFunctions.compareRespMsgWithExpectedFile(
                        response.statusCode,
                        expectedCommon.httpStatus.failedCode.badRequest,
                        response,
                        expectedResults.apiRespMsg.failed.invalidUserId
                    );
                });
            }
        }
    );
});
