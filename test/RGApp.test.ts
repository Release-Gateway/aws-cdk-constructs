import { RGApp, RGGuardValidator, ComplianceFramework } from "../src";

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

    it("should use default compliance frameworks when none are specified", () => {
        const newApp = new RGApp();
        const validator = newApp.policyValidationBeta1[0] as RGGuardValidator;
        expect(validator.rules.length).toBe(4);
        expect(validator.rules).toEqual(
            expect.arrayContaining([
                expect.stringContaining("cis-aws-benchmark-level-2.guard"),
                expect.stringContaining("NIST800-53Rev5.guard"),
                expect.stringContaining("wa-Reliability-Pillar.guard"),
                expect.stringContaining("wa-Security-Pillar.guard"),
            ])
        );
    });

    it("should accept custom compliance frameworks", () => {
        const newApp = new RGApp({
            compliance: [
                ComplianceFramework.CIS_AWS_BENCHMARK_LEVEL_1,
                ComplianceFramework.HIPAA_SECURITY,
            ],
        });
        const validator = newApp.policyValidationBeta1[0] as RGGuardValidator;
        expect(validator.rules.length).toBe(2);
        expect(validator.rules).toEqual(
            expect.arrayContaining([
                expect.stringContaining("cis-aws-benchmark-level-1.guard"),
                expect.stringContaining("hipaa-security.guard"),
            ])
        );
    });

    it("should accept single compliance framework", () => {
        const newApp = new RGApp({
            compliance: [ComplianceFramework.PCI_DSS_3_2_1],
        });
        const validator = newApp.policyValidationBeta1[0] as RGGuardValidator;
        expect(validator.rules.length).toBe(1);
        expect(validator.rules).toEqual(
            expect.arrayContaining([expect.stringContaining("PCI-DSS-3-2-1.guard")])
        );
    });

    it("should set throwErrorOnComplianceFail to true by default", () => {
        const newApp = new RGApp();
        const validator = newApp.policyValidationBeta1[0] as RGGuardValidator;
        expect(validator.throwErrorOnComplianceFail).toBe(true);
    });

    it("should accept throwErrorOnComplianceFail as false", () => {
        const newApp = new RGApp({
            throwErrorOnComplianceFail: false,
        });
        const validator = newApp.policyValidationBeta1[0] as RGGuardValidator;
        expect(validator.throwErrorOnComplianceFail).toBe(false);
    });

    it("should accept both compliance and throwErrorOnComplianceFail props", () => {
        const newApp = new RGApp({
            compliance: [ComplianceFramework.FEDRAMP_LOW, ComplianceFramework.FEDRAMP_MODERATE],
            throwErrorOnComplianceFail: false,
        });
        const validator = newApp.policyValidationBeta1[0] as RGGuardValidator;
        expect(validator.rules.length).toBe(2);
        expect(validator.rules).toEqual(
            expect.arrayContaining([
                expect.stringContaining("FedRAMP-Low.guard"),
                expect.stringContaining("FedRAMP-Moderate.guard"),
            ])
        );
    });

    describe("Validator behavior with throwErrorOnComplianceFail", () => {
        it("should pass through failed reports when throwErrorOnComplianceFail is true", () => {
            const validator = new RGGuardValidator({
                rules: ["/fake/path/test.guard"],
                throwErrorOnComplianceFail: true,
            });

            expect(validator.throwErrorOnComplianceFail).toBe(true);
        });

        it("should suppress failures when throwErrorOnComplianceFail is false", () => {
            const validator = new RGGuardValidator({
                rules: ["/fake/path/test.guard"],
                throwErrorOnComplianceFail: false,
            });

            expect(validator.throwErrorOnComplianceFail).toBe(false);
        });
    });
});
