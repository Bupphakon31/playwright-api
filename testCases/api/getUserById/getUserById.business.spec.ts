import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onGetUser } from "../../../support/services/getUser";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe.only("Get User API business", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/getUser.json`);
    });

    test(
        "GET: [/api/v1/users/{userId}] response [success] when userId is exist",
        { tag: ["@high", "@regression"] },
        async () => {
            for (let i = 0; i < dataTest.userId.length; i++) {
                const userId = dataTest.userId[i];

                await test.step("Call Get User API with valid method", async () => {
                    response = await onGetUser.callGetUser(`${String(ENV.V1_USER)}/${userId}`);
                });

                await test.step("Verify Get User API response", async () => {
                    onGetUser.verifyUserResponse(response);
                });
            }
        }
    );
});
