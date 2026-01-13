import { expect } from "@playwright/test";

class CommonFunctions {
    public async verifyFailedResponse(
        actualResult: Record<string, any>,
        expectedCode: number,
        expectedResult: Record<string, any>
    ) {
        expect(actualResult.statusCode).toBe(expectedCode);
        expect(actualResult.body).toEqual(expectedResult);
    }

    public async compareRespMsgWithExpectedFile(
        statusCode: number,
        expectedCode: number,
        actualResult: Record<string, any>,
        expectedResult: Record<string, any>
    ) {
        expect(statusCode).toBe(expectedCode);
        expect(actualResult.body).toEqual(expectedResult);
    }
}

export const onCommonFunctions: CommonFunctions = new CommonFunctions();
