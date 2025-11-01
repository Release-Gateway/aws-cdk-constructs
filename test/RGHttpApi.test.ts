import { Template } from "aws-cdk-lib/assertions";
import { Stack } from "aws-cdk-lib";
import { TestApp } from "./utils/TestApp";
import { TestStack } from "./utils/TestStack";
import { RGHttpApi } from "../src";

describe("RGHttpApi", () => {
    describe("Default behaviour", () => {
        let app: TestApp;
        let stack: TestStack;
        let template: Template;

        beforeAll(() => {
            app = new TestApp();
            stack = new TestStack(app);
            new RGHttpApi(stack, "test-http-api");
            template = Template.fromStack(stack);
        });

        it("should be compliant with cloud standards", () => {
            expect(app.isCompliantWithCloudStandards()).toBe(true);
        });

        it("should only have a single stage", () => {
            template.resourceCountIs("AWS::ApiGatewayV2::Stage", 1);
        });

        it("should have auto deployment configured", () => {
            const api = template.findResources("AWS::ApiGatewayV2::Api");
            const apiLogicalId = Object.keys(api)[0];

            template.hasResourceProperties("AWS::ApiGatewayV2::Stage", {
                ApiId: {
                    Ref: apiLogicalId,
                },
                AutoDeploy: true,
                StageName: "$default",
            });
        });

        it("should have throttling configured", () => {
            template.hasResourceProperties("AWS::ApiGatewayV2::Stage", {
                DefaultRouteSettings: {
                    ThrottlingBurstLimit: 10,
                    ThrottlingRateLimit: 10,
                },
            });
        });
    });

    it("should throw if not part of RGStack", () => {
        const app = new TestApp();
        const invalidStack = new Stack(app, "invalid-stack");
        expect(() => {
            new RGHttpApi(invalidStack, "test-http-api");
        }).toThrow("RGHttpApi must be used within an RGStack");
    });
});
