import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onGetUser } from "../../../support/services/getUser";

test.describe("Get User API business", () => {
    let response: Record<string, any> = {};

    test("GET: [/api/v1/users] response [success] when found users", { tag: ["@high", "@regression"] }, async () => {
        await test.step("Call Get User API with valid method", async () => {
            response = await onGetUser.callGetUser(String(ENV.V1_USER));
        });

        await test.step("Verify Get User API response", async () => {
            onGetUser.verifyUserResponse(response);
        });
    });
});
