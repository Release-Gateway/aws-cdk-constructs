import { RGApp, RGGuardValidator } from "../src";

describe("RGApp", () => {
    it("should instantiate without error", () => {
        expect(() => {
            new RGApp();
        }).not.toThrow();
    });
    it("should set RGGuardValidator to policyValidation by default", () => {
        const newApp = new RGApp();
        expect(newApp.policyValidationBeta1.length).toBe(1);
        expect(newApp.policyValidationBeta1[0]).toBeInstanceOf(RGGuardValidator);
    });
});
