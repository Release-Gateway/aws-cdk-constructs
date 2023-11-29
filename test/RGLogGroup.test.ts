import { Template } from "aws-cdk-lib/assertions";
import { Stack } from "aws-cdk-lib";
import { TestApp } from "./utils/TestApp";
import { TestStack } from "./utils/TestStack";
import { RGLogGroup } from "../src";

describe("RGLogGroup", () => {
    describe("Default behaviour", () => {
        let app: TestApp;
        let stack: TestStack;
        let template: Template;

        beforeAll(() => {
            app = new TestApp();
            stack = new TestStack(app, "test-stack");
            new RGLogGroup(stack, "test-log-group", {});
            template = Template.fromStack(stack);
        });

        it("should be compliant with cloud standards", () => {
            expect(app.isCompliantWithCloudStandards()).toBe(true);
        });

        it("should be encrypted using KMS key", () => {
            template.findResources("AWS::Logs::LogGroup");
            const templateKmsKeys = template.findResources("AWS::KMS::Key");
            const templateKmsKeyNames = Object.keys(templateKmsKeys);
            expect(templateKmsKeyNames.length).toBe(1);

            template.hasResourceProperties("AWS::Logs::LogGroup", {
                KmsKeyId: {
                    "Fn::GetAtt": [templateKmsKeyNames[0], "Arn"],
                },
            });
        });

        it("should have deletion policies", () => {
            template.hasResource("AWS::Logs::LogGroup", {
                DeletionPolicy: "Delete",
                UpdateReplacePolicy: "Delete",
            });
        });
    });

    it("should throw if not part of RGStack", () => {
        const app = new TestApp();
        const invalidStack = new Stack(app, "test-stack");
        expect(() => {
            new RGLogGroup(invalidStack, "test-log-group", {});
        }).toThrow("RGLogGroup must be used within an RGStack");
    });
});
