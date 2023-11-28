import { TestApp } from "../../tests/utils/TestApp";
import { RGQueue } from "./";
import { TestStack } from "../../tests/utils/TestStack";
import { Template } from "aws-cdk-lib/assertions";
import { Stack } from "aws-cdk-lib";

describe("RGQueue", () => {
    describe("Default behaviour", () => {
        let app: TestApp;
        let stack: TestStack;
        let template: Template;

        beforeAll(() => {
            app = new TestApp();
            stack = new TestStack(app);
            new RGQueue(stack, "test-queue");
            template = Template.fromStack(stack);
        });

        it("should be compliant with cloud standards validator ", () => {
            expect(app.isCompliantWithCloudStandards()).toBe(true);
        });

        it("should automatically create a DLQ for every queue", () => {
            template.resourceCountIs("AWS::SQS::Queue", 2);
        });

        it("should have deletion policies", () => {
            template.hasResource("AWS::SQS::Queue", {
                DeletionPolicy: "Delete",
                UpdateReplacePolicy: "Delete",
            });
        });
    });

    it("should not create a DLQ if specifying a Queue is a DLQ directly", () => {
        const app2 = new TestApp();
        const stack2 = new TestStack(app2);
        new RGQueue(stack2, "test-queue", { isDeadLetterQueue: true });
        const template2 = Template.fromStack(stack2);
        template2.resourceCountIs("AWS::SQS::Queue", 1);
    });

    it("should throw if not part of RGStack", () => {
        const app2 = new TestApp();
        const invalidStack = new Stack(app2, "test-stack");
        expect(() => {
            new RGQueue(invalidStack, "test-queue", {});
        }).toThrow("RGLogGroup must be used within an RGStack");
    });
});
