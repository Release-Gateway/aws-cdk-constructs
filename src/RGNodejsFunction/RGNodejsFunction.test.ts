import { TestApp } from "../../tests/utils/TestApp";
import { RGNodejsFunction, RGNodejsFunctionProps } from "./";
import { join } from "path";
import { testVpc } from "../../tests/utils/vpc";
import { TestStack } from "../../tests/utils/TestStack";
import { Match, Template } from "aws-cdk-lib/assertions";
import { IVpc } from "aws-cdk-lib/aws-ec2";

describe("RGNodejsFunction", () => {
    describe("Default behaviour", () => {
        let app: TestApp;
        let stack: TestStack;
        let vpc: IVpc;
        let template: Template;
        beforeAll(() => {
            app = new TestApp();
            stack = new TestStack(app);
            vpc = testVpc(stack, "vpc");
            new RGNodejsFunction(stack, "test-function", {
                entry: join(__dirname, "../../tests/utils/test-handler.ts"),
                vpc,
            });
            template = Template.fromStack(stack);
        });
        it("should be compliant with cloud standards", () => {
            expect(app.isCompliantWithCloudStandards()).toBe(true);
        });
        it("should have reservedConcurrentExecutions set", () => {
            template.hasResourceProperties("AWS::Lambda::Function", {
                ReservedConcurrentExecutions: 10,
            });
        });
        it("should have no network connectivity", () => {
            const securityGroups = template.findResources("AWS::EC2::SecurityGroup");
            expect(Object.keys(securityGroups).length).toBe(1);

            // Single security group with no ingress or egress rules
            template.hasResourceProperties("AWS::EC2::SecurityGroup", {
                VpcId: vpc.vpcId,
                SecurityGroupEgress: [
                    {
                        CidrIp: "255.255.255.255/32",
                        Description: "Disallow all traffic",
                        FromPort: 252,
                        IpProtocol: "icmp",
                        ToPort: 86,
                    },
                ],
            });

            // SG is used by the lambda
            template.hasResourceProperties("AWS::Lambda::Function", {
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            "Fn::GetAtt": [Object.keys(securityGroups)[0], "GroupId"],
                        },
                    ],
                },
            });
        });

        it("should have a DLQ configured", () => {
            const dlq = template.findResources("AWS::SQS::Queue");
            template.hasResourceProperties("AWS::Lambda::Function", {
                DeadLetterConfig: {
                    TargetArn: {
                        "Fn::GetAtt": [Object.keys(dlq)[0], "Arn"],
                    },
                },
            });
            expect(Object.keys(dlq).length).toBe(1);
        });
        describe("Log group", () => {
            let fnLogicalId: string;
            let kmsLogicalId: string;

            beforeAll(() => {
                fnLogicalId = Object.keys(template.findResources("AWS::Lambda::Function"))[0];
                kmsLogicalId = Object.keys(template.findResources("AWS::KMS::Key"))[0];
            });

            it("should only have one", () => {
                template.resourceCountIs("AWS::Logs::LogGroup", 1);
            });
            it("should be encrypted", () => {
                template.hasResourceProperties("AWS::Logs::LogGroup", {
                    KmsKeyId: {
                        "Fn::GetAtt": [kmsLogicalId, "Arn"],
                    },
                });
            });
            it("should be named according to lambda log convention", () => {
                template.hasResourceProperties("AWS::Logs::LogGroup", {
                    LogGroupName: {
                        "Fn::Join": [
                            "",
                            [
                                "/aws/lambda/",
                                {
                                    Ref: fnLogicalId,
                                },
                            ],
                        ],
                    },
                });
            });
            it("should have retention configured", () => {
                template.hasResourceProperties("AWS::Logs::LogGroup", {
                    RetentionInDays: Match.anyValue(),
                });
            });
            it("should have deletion policies", () => {
                template.hasResource("AWS::Logs::LogGroup", {
                    DeletionPolicy: "Delete",
                    UpdateReplacePolicy: "Delete",
                });
            });
        });
    });

    it("should throw an error if vpc argument is not provided", () => {
        const app = new TestApp();
        const stack = new TestStack(app);
        expect(() => {
            new RGNodejsFunction(stack, "test-function", {
                entry: join(__dirname, "../testing/test-handler.ts"),
            } as RGNodejsFunctionProps);
        }).toThrow("Constructor property `vpc` is required.");
    });
});
