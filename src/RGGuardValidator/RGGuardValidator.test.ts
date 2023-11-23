import { RGGuardValidator } from "./RGGuardValidator";

describe("GuardValidator", () => {
    it("should instantiate without error", () => {
        expect(() => {
            new RGGuardValidator();
        }).not.toThrow();
    });
});
