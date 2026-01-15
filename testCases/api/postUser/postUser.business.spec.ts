import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onPostUser } from "../../../support/services/postUser";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe("Post User API business", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let commonDataTest: Record<string, any> = {};
    let headers: Record<string, any> = {};
    let requestBody: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/postUser.json`);
        commonDataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`);
        headers = commonDataTest.headers.contentType.valid;
        requestBody = dataTest.requestBody.valid;
        requestBody.name = dataTest.validName;
        requestBody.email = dataTest.validEmail;
        requestBody.password = dataTest.validPassword;
        requestBody.avatar = dataTest.validAvatar;
    });

    test(
        "POST: [/api/v1/users/{userId}] response [success] when create user successfully",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step("Call Post User API with valid method", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onPostUser.verifyPostUserResponse(response);
            });
        }
    );

    test.skip(
        "POST: [/api/v1/users/{userId}] response [success] when create user duplicate",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call Post User API with valid method", async () => {
                response = await onPostUser.callPostUser(String(ENV.V1_USER), headers, undefined, requestBody);
            });

            await test.step("Verify Post User API response", async () => {
                await onPostUser.verifyPostUserResponse(response);
            });
        }
    );
});
