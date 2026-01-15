import { test } from "@playwright/test";
import { ENV } from "../../../globalVariables";
import { onGetUser } from "../../../support/services/getUser";
import { onCommonFunctions } from "../../../support/services/common";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe("Get User API validation", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let commonDataTest: Record<string, any> = {};
    let expectedCommon: Record<string, any> = {};
    let expectedResults: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/getUser.json`);
        commonDataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`);
        expectedCommon = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/common.json`);
        expectedResults = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/getUser.json`);
    });

    test("POST: [/api/v1/users] response [failed] when invalid method", { tag: ["@high", "@functional"] }, async () => {
        await test.step("Call Get User API with invalid method", async () => {
            response = await onGetUser.callGetUser(String(ENV.V1_USER), undefined, undefined, true);
        });

        await test.step("Verify Get User API response", async () => {
            await onCommonFunctions.compareRespMsgWithExpectedFile(
                response.statusCode,
                expectedCommon.httpStatus.failedCode.notFound,
                response,
                expectedResults.apiRespMsg.failed.invalidMethodUserPath
            );
            //expected to be 405 Method Not Allowed
        });
    });

    test("GET: [/api/v1/users] response [failed] when invalid path", { tag: ["@high", "@functional"] }, async () => {
        await test.step("Call GET User API with invalid path", async () => {
            response = await onGetUser.callGetUser(dataTest.invalidPath);
        });

        await test.step("Verify Get User API response", async () => {
            await onCommonFunctions.compareRespMsgWithExpectedFile(
                response.statusCode,
                expectedCommon.httpStatus.failedCode.notFound,
                response,
                expectedResults.apiRespMsg.failed.invalidPathUser
            );
        });
    });

    test(
        "GET: [/api/v1/users] response [success] with unexpected query parameters",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Get User API with unexpected query parameters", async () => {
                response = await onGetUser.callGetUser(String(ENV.V1_USER), commonDataTest.unexpectedParam);
            });

            await test.step("Verify Get User API response", async () => {
                await onGetUser.verifyGetUserResponse(response);
            });
        }
    );

    test(
        "GET: [/api/v1/users] response [success] with unexpected request body",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Get User API with unexpected request body", async () => {
                response = await onGetUser.callGetUser(String(ENV.V1_USER), undefined, commonDataTest.unexpectedBody);
            });

            await test.step("Verify Get User API response", async () => {
                await onGetUser.verifyGetUserResponse(response);
            });
        }
    );
});
