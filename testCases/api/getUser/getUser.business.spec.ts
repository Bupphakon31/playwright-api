import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onGetUser } from "../../../support/services/getUser";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe("Get User API business", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/getUser.json`);
    });

    test("GET: [/api/v1/users] response [success] when found users", { tag: ["@high", "@regression"] }, async () => {
        await test.step("Call Get User API with valid method", async () => {
            response = await onGetUser.callGetUser(String(ENV.V1_USERS));
        });

        await test.step("Verify Get User API response", async () => {
            console.log("Response Body: ", response.body);
            onGetUser.verifyUserResponse(response);
        });
    });
});
