import { test } from "@playwright/test";
import { ENV } from "../../../globalVariables";
import { onGetUser } from "../../../support/services/getUser";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe("Get User API validation", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};

    test("POST: [/api/v1/users] response [failed] when invalid method", { tag: ["@high", "@regression"] }, async () => {
        await test.step("Call Get User API with invalid method", async () => {
            response = await onGetUser.callGetUser(String(ENV.V1_USERS), undefined, undefined, true);
        });
    });
});
