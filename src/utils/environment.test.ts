import { getEnv } from "./environment";

describe("Environment utils", () => {
    describe("#getEnv", () => {
        let originalEnv: unknown;
        beforeAll(() => {
            originalEnv = process.env["TEST_ENV_VAR"];
            process.env["TEST_ENV_VAR"] = "test123";
        });
        afterAll(() => {
            process.env["TEST_ENV_VAR"] = originalEnv as string;
        });

        it("should return the environment variable if it exists", () => {
            expect(getEnv("TEST_ENV_VAR")).toEqual("test123");
        });
        it("should throw an error if the environment variable does not exist", () => {
            expect(() => {
                getEnv("DOES_NOT_EXIST");
            }).toThrowError("Environment variable DOES_NOT_EXIST not set");
        });
    });
});
