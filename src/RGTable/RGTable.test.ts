import { TestApp } from "../testing/TestApp";

import { TestStack } from "../testing/TestStack";
import { Template } from "aws-cdk-lib/assertions";
import { RGTable } from "./RGTable";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";

describe("RGQueue", () => {
    let app: TestApp;
    let stack: TestStack;
    let template: Template;

    beforeAll(() => {
        app = new TestApp();
        stack = new TestStack(app, "test-stack", {
            serviceName: "test-service",
            version: "1.0.0",
            env: { region: "eu-west-1" },
        });
        new RGTable(stack, "test-table", {
            partitionKey: { name: "id", type: AttributeType.STRING },
        });
        template = Template.fromStack(stack);
    });

    it("should be compliant with cloud standards validator ", () => {
        expect(app.isCompliantWithCloudStandards()).toBe(true);
    });

    it("should have Stack KMS key configured as replica server side encryption", () => {
        const templateKmsKeys = template.findResources("AWS::KMS::Key");
        const templateKmsKeyNames = Object.keys(templateKmsKeys);
        expect(templateKmsKeyNames.length).toBe(1);

        template.hasResourceProperties("AWS::DynamoDB::GlobalTable", {
            SSESpecification: {
                SSEEnabled: true,
                SSEType: "KMS",
            },
            Replicas: [
                {
                    Region: "eu-west-1",
                    SSESpecification: {
                        KMSMasterKeyId: {
                            "Fn::GetAtt": [templateKmsKeyNames[0], "Arn"],
                        },
                    },
                },
            ],
        });
    });
});
