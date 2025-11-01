import { Template } from "aws-cdk-lib/assertions";
import { Key } from "aws-cdk-lib/aws-kms";
import { TestApp } from "./utils/TestApp";
import { RGStack, RGStackProps } from "../src";
import { getVersion } from "../src/utils/environment";

describe("RGStack", () => {
    let originalEnv: unknown;
    beforeAll(() => {
        originalEnv = process.env["NODE_ENV"];
        process.env["NODE_ENV"] = "dev123";
    });
    afterAll(() => {
        process.env["NODE_ENV"] = originalEnv as string;
    });

    describe("Default behaviour", () => {
        let app: TestApp;
        let stack: RGStack;
        let template: Template;

        beforeAll(() => {
            app = new TestApp();
            stack = new RGStack(app, "RGStack", {
                serviceName: "test",
                version: "1.0.0",
            });
            template = Template.fromStack(stack);
        });

        it("should apply default tags", () => {
            expect(stack.tags.tagValues()).toMatchObject({
                env: "dev123",
                "release-gateway:aws-cdk-construct-version": getVersion(),
                service: "test",
                version: "1.0.0",
            });
        });

        describe("Stack KMS key", () => {
            it("should only create one", () => {
                template.resourceCountIs("AWS::KMS::Key", 1);
            });

            it("should create stack KMS key", () => {
                template.hasResourceProperties("AWS::KMS::Key", {
                    EnableKeyRotation: true,
                });
            });

            it("should expose instance property kmsKey", () => {
                expect(stack.kmsKey).toBeInstanceOf(Key);
            });
        });
    });

    it("should throw if no serviceName is set", () => {
        const app = new TestApp();
        expect(() => {
            // @ts-expect-error Intentionally imitting serviceName to test validation
            new RGStack(app, "RGStack", { version: "1.0.0" });
        }).toThrow("Constructor property `serviceName` is required.");
    });

    it("should throw if serviceName is empty", () => {
        const app = new TestApp();
        expect(() => {
            new RGStack(app, "RGStack", { serviceName: "", version: "1.0.0" });
        }).toThrow("Too small: expected string to have >=1 characters");
        expect(() => {
            // @ts-expect-error Intentionally passing null to test validation
            new RGStack(app, "RGStack", { serviceName: null, version: "1.0.0" });
        }).toThrow("Constructor property `serviceName` is required.");
    });

    it("should throw if no version is set", () => {
        const app = new TestApp();
        expect(() => {
            new RGStack(app, "RGStack", {
                serviceName: "test",
            } as RGStackProps);
        }).toThrow("Constructor property `version` is required.");
    });

    it("should throw if version is empty", () => {
        const app = new TestApp();
        expect(() => {
            new RGStack(app, "RGStack", { serviceName: "test", version: "" });
        }).toThrow("Too small: expected string to have >=1 characters");
        expect(() => {
            // @ts-expect-error Intentionally passing null to test validation
            new RGStack(app, "RGStack", { serviceName: "test", version: null });
        }).toThrow("Constructor property `version` is required.");
    });
});
