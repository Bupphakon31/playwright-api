import { expect } from "@playwright/test";

class CommonFunctions {
    public async compareRespMsgWithExpectedFile(
        statusCode: number,
        expectedCode: number,
        actualResult: Record<string, any>,
        expectedResult: Record<string, any>
    ) {
        expect(statusCode).toBe(expectedCode);
 expect(actualResult.body).toEqual(expectedResult);
    }

    public async verifyRespStatus(
        actualStatusCode: number,
  expectedStatusCode: number,
        actualSStatusText: string,
 expectedStatusText: string
    ) {
expect(actualStatusCode).toBe(expectedStatusCode);
expect(actualSStatusText).toBe(expectedStatusText);
    }
}

export const onCommonFunctions: CommonFunctions = new CommonFunctions();
