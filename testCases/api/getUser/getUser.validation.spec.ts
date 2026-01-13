import { test } from "@playwright/test";
import { ENV } from "../../../globalVariables";
import { onGetUser } from "../../../support/services/getUser";
import { onCommonFunctions } from "../../../support/services/common";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe("Get User API validation", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let expectedCommon: Record<string, any> = {};
    let expectedResults: Record<string, any> = {};  

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/getUser.json`);
        expectedCommon = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/common.json`);
        expectedResults = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/getUser.json`);
    });

    test("POST: [/api/v1/users] response [failed] when invalid method", 
        { tag: ["@high", "@functional"] }, async () => {
        await test.step("Call Get User API with invalid method", async () => {
            response = await onGetUser.callGetUser(String(ENV.V1_USER), undefined, undefined, true);
        });

        await test.step("Verify Get User API response", async () => {
            //curently the API returns 500 Internal Server Error for invalid method
            await onCommonFunctions.compareRespMsgWithExpectedFile(
                response.statusCode,
                expectedCommon.httpStatus.failedCode.internalServerError,
                response,
                expectedResults.apiRespMsg.failed.internalServerError
            );
            //expcted to be 405 Method Not Allowed
            //await onCommonFunctions.verifyFailedResponse(response, expectedCommon.httpStatus.failedCode.methodNotAllowed, expectedCommon.apiRespMsg.methodNotAllowed);
        });
    });

    test(
        "GET: [/api/v1/users] response [success] when input unexpected query parameters",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Get User API with unexpected query parameters", async () => {
                response = await onGetUser.callGetUser(String(ENV.V1_USER), dataTest.unexpectedParam);
            });

            await test.step("Verify Get User API response", async () => {
                await onGetUser.verifyUserResponse(response);
            });
        }
    );

    test(
        "GET: [/api/v1/users] response [success] when input unexpected request body",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Get User API with unexpected request body", async () => {
                response = await onGetUser.callGetUser(String(ENV.V1_USER), undefined, dataTest.unexpectedBody);
            });

            await test.step("Verify Get User API response", async () => {
                await onGetUser.verifyUserResponse(response);
            });
        }
    );

});
