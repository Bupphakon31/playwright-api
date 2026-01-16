import { ENV } from "../../../globalVariables";
import { test } from "@playwright/test";
import { onGetProfile } from "../../../support/services/getProfile";
import { onPostLogin } from "../../../support/services/postLogin";
import { onCommonFunctions } from "../../../support/services/common";
import { onFileExtensionUtil } from "../../../support/utils/fileExtensionUtil";

test.describe("Get Profile business", () => {
    let response: Record<string, any> = {};
    let responseLogin: Record<string, any> = {};
    let headers: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let commonDataTest: Record<string, any> = {};
    let expectedCommon: Record<string, any> = {};
    let requestBodyLogin: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/getProfile.json`);
        commonDataTest = await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`);
        expectedCommon = await onFileExtensionUtil.readDataFromJson(`./resources/expectedResults/common.json`);
        headers = (await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/common.json`)).headers.contentType
            .valid;
        requestBodyLogin = (await onFileExtensionUtil.readDataFromJson(`./resources/dataTest/postLogin.json`))
            .requestBody.valid;
        requestBodyLogin.email = String(ENV.VALID_EMAIL_JOHN);
        requestBodyLogin.password = String(ENV.VALID_PASSWORD_JOHN);
        responseLogin = await onPostLogin.callPostLogin(
            String(ENV.V1_AUTH_LOGIN),
            headers,
            undefined,
            requestBodyLogin
        );
    });

    test(
        "GET: [/api/v1/auth/profile] response [success] when found profile",
        { tag: ["@high", "@regression"] },
        async () => {
            commonDataTest.headers.authAndContentType.authorization = "Bearer " + responseLogin.body.access_token;

            await test.step("Call Get Profile API with valid access token", async () => {
                response = await onGetProfile.callGetProfile(
                    String(ENV.V1_AUTH_PROFILE),
                    commonDataTest.headers.authAndContentType
                );
            });

            await test.step("Verify Get Profile API response", async () => {
                await onGetProfile.verifyGetProfileResponse(response);
            });
        }
    );

    test(
        "GET: [/api/v1/auth/profile] response [failed] when access token is expired",
        { tag: ["@high", "@regression"] },
        async () => {
            commonDataTest.headers.authAndContentType.authorization = "Bearer " + dataTest.expiredAccessToken;

            await test.step("Call Get Profile API with access token is expired", async () => {
                response = await onGetProfile.callGetProfile(
                    String(ENV.V1_AUTH_PROFILE),
                    commonDataTest.headers.authAndContentType
                );
            });

            await test.step("Verify Get Profile API response", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.failedCode.unauthorized,
                    response,
                    expectedCommon.apiRespMsg.failed.unauthorized
                );
            });
        }
    );
});
