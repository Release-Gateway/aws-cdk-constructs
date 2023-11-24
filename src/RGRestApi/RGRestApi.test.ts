import { TestApp } from "../testing/TestApp";
import { TestStack } from "../testing/TestStack";
import { RGRestApi } from "./RGRestApi";
import { MockIntegration, PassthroughBehavior } from "aws-cdk-lib/aws-apigateway";

describe("RGHttpApi", () => {
    it("should be compliant with cloud standards", () => {
        const app = new TestApp();
        const stack = new TestStack(app);
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

        expect(app.isCompliantWithCloudStandards()).toBe(true);
    });
});
