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

    describe("CDK Synthesis integration tests", () => {
        it("should throw error on synthesis when non-compliant and throwErrorOnComplianceFail is true", () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { RGGuardValidator } = require("../src");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { writeFileSync } = require("fs");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { join } = require("path");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { tmpdir } = require("os");

            // Create a test guard rule that will always fail for S3 buckets
            const testRulePath = join(tmpdir(), "test-always-fail.guard");
            writeFileSync(
                testRulePath,
                `
# Test guard rule that always fails for any S3 bucket
let s3_buckets = Resources.*[ Type == 'AWS::S3::Bucket' ]

rule TEST_S3_RULE_ALWAYS_FAILS when %s3_buckets !empty {
    %s3_buckets {
        # This condition will always fail - no bucket will have this specific name
        Properties.BucketName == 'impossible-bucket-name-that-will-never-exist-12345'
        <<
            Violation: S3 bucket does not meet test requirements
            Fix: This is a test rule designed to fail
        >>
    }
}
`
            );

            // Create a validator with throwErrorOnComplianceFail=true
            const validator = new RGGuardValidator({
                rules: [testRulePath],
                controlTowerRulesEnabled: false,
                throwErrorOnComplianceFail: true,
            });

            // Create a mock validation context with an S3 bucket
            const mockContext = {
                templatePaths: [join(tmpdir(), "test-template.json")],
            };

            // Write a CloudFormation template with an S3 bucket
            writeFileSync(
                mockContext.templatePaths[0],
                JSON.stringify({
                    Resources: {
                        TestBucket: {
                            Type: "AWS::S3::Bucket",
                            Properties: {
                                BucketName: "actual-test-bucket-name",
                            },
                        },
                    },
                })
            );

            // Call validate() - it should return a failed report
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = validator.validate(mockContext as any);

            // When throwErrorOnComplianceFail is true, the report should have success=false
            expect(result.success).toBe(false);
            expect(result.violations.length).toBeGreaterThan(0);
        });

        it("should NOT throw error on synthesis when non-compliant but throwErrorOnComplianceFail is false", () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { RGGuardValidator } = require("../src");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { writeFileSync } = require("fs");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { join } = require("path");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { tmpdir } = require("os");

            // Create a test guard rule that will always fail for S3 buckets
            const testRulePath = join(tmpdir(), "test-always-fail-no-throw.guard");
            writeFileSync(
                testRulePath,
                `
# Test guard rule that always fails for any S3 bucket
let s3_buckets = Resources.*[ Type == 'AWS::S3::Bucket' ]

rule TEST_S3_RULE_ALWAYS_FAILS when %s3_buckets !empty {
    %s3_buckets {
        # This condition will always fail - no bucket will have this specific name
        Properties.BucketName == 'impossible-bucket-name-that-will-never-exist-67890'
        <<
            Violation: S3 bucket does not meet test requirements
            Fix: This is a test rule designed to fail
        >>
    }
}
`
            );

            // Create a validator with throwErrorOnComplianceFail=false
            const validator = new RGGuardValidator({
                rules: [testRulePath],
                controlTowerRulesEnabled: false,
                throwErrorOnComplianceFail: false,
            });

            // Create a mock validation context with an S3 bucket
            const mockContext = {
                templatePaths: [join(tmpdir(), "test-template-no-throw.json")],
            };

            // Write a CloudFormation template with an S3 bucket
            writeFileSync(
                mockContext.templatePaths[0],
                JSON.stringify({
                    Resources: {
                        TestBucket: {
                            Type: "AWS::S3::Bucket",
                            Properties: {
                                BucketName: "actual-test-bucket-name-no-throw",
                            },
                        },
                    },
                })
            );

            // Call validate() - it should return a success despite violations
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = validator.validate(mockContext as any);

            // When throwErrorOnComplianceFail is false, the report should have success=true
            // even though there are violations
            expect(result.success).toBe(true);
            expect(result.violations.length).toBeGreaterThan(0);
            expect(result.metadata?.suppressedFailure).toBe("true");
        });

        it("should succeed synthesis when compliant with throwErrorOnComplianceFail true", () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { RGStack } = require("../src");

            const app = new RGApp({
                throwErrorOnComplianceFail: true,
            });

            // Create a compliant stack with no resources
            new RGStack(app, "CompliantStack", {
                serviceName: "test-service",
                version: "1.0.0",
            });

            // Synthesis should succeed with compliant infrastructure
            expect(() => {
                app.synth();
            }).not.toThrow();
        });
    });
});
