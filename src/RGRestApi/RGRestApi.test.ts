import { TestApp } from "../../tests/utils/TestApp";
import { TestStack } from "../../tests/utils/TestStack";
import { RGRestApi } from "./RGRestApi";
import { MockIntegration, PassthroughBehavior } from "aws-cdk-lib/aws-apigateway";
import { Template } from "aws-cdk-lib/assertions";
import { Stack } from "aws-cdk-lib";

describe("RGHttpApi", () => {
    describe("Default behaviour", () => {
        let app: TestApp;
        let stack: TestStack;
        let template: Template;

        beforeAll(() => {
            app = new TestApp();
            stack = new TestStack(app);
            const api = new RGRestApi(stack, "test-rest-api", {});
            api.root.addMethod(
                "ANY",
                new MockIntegration({
                    integrationResponses: [
                        {
                            statusCode: "200",
                        },
                    ],
                    passthroughBehavior: PassthroughBehavior.NEVER,
                    requestTemplates: {
                        "application/json": '{"statusCode": 200}',
                    },
                })
            );
            template = Template.fromStack(stack);
        });

        it("should be compliant with cloud standards", () => {
            expect(app.isCompliantWithCloudStandards()).toBe(true);
        });

        it("should have access logging enabled", () => {
            const logGroup = template.findResources("AWS::Logs::LogGroup");
            const logGroupLogicalId = Object.keys(logGroup)[0];

            template.hasResourceProperties("AWS::ApiGateway::Stage", {
                AccessLogSetting: {
                    DestinationArn: {
                        "Fn::GetAtt": [logGroupLogicalId, "Arn"],
                    },
                    Format: '$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] "$context.httpMethod $context.resourcePath $context.protocol" $context.status $context.responseLength $context.requestId',
                },
            });
        });

        it("should have auto deployment configured", () => {
            const api = template.findResources("AWS::ApiGateway::RestApi");
            const apiLogicalId = Object.keys(api)[0];

            template.hasResourceProperties("AWS::ApiGateway::Deployment", {
                RestApiId: {
                    Ref: apiLogicalId,
                },
            });
        });

        it("should be a regional endpoint", () => {
            template.hasResourceProperties("AWS::ApiGateway::RestApi", {
                EndpointConfiguration: {
                    Types: ["REGIONAL"],
                },
            });
        });
    });

    it("should throw if not part of RGStack", () => {
        const app = new TestApp();
        const invalidStack = new Stack(app);

        expect(() => {
            new RGRestApi(invalidStack, "test-rest-api", {});
        }).toThrow("RGRestApi must be used within an RGStack");
    });
});
