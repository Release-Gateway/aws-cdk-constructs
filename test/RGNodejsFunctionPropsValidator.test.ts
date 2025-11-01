import { Queue } from "aws-cdk-lib/aws-sqs";
import { RGNodejsFunctionPropsValidator } from "../src/RGNodejsFunction/RGNodejsFunctionPropsValidator";
import { TestApp } from "./utils/TestApp";
import { TestStack } from "./utils/TestStack";

describe("RGNodejsFunctionPropsValidator", () => {
    it("should throw expected validation errors", () => {
        expect(() => {
            RGNodejsFunctionPropsValidator.parse({});
        }).toThrowErrorMatchingInlineSnapshot(`
            "[
              {
                "expected": "number",
                "code": "invalid_type",
                "path": [
                  "reservedConcurrentExecutions"
                ],
                "message": "Invalid input: expected number, received undefined"
              },
              {
                "expected": "boolean",
                "code": "invalid_type",
                "path": [
                  "allowAllOutbound"
                ],
                "message": "Invalid input: expected boolean, received undefined"
              },
              {
                "expected": "boolean",
                "code": "invalid_type",
                "path": [
                  "deadLetterQueueEnabled"
                ],
                "message": "Invalid input: expected boolean, received undefined"
              },
              {
                "code": "custom",
                "path": [
                  "deadLetterQueue"
                ],
                "message": "Input not instance of Queue2"
              },
              {
                "expected": "string",
                "code": "invalid_type",
                "path": [
                  "entry"
                ],
                "message": "Invalid input: expected string, received undefined"
              },
              {
                "expected": "object",
                "code": "invalid_type",
                "path": [
                  "vpc"
                ],
                "message": "Constructor property \`vpc\` is required."
              }
            ]"
        `);
    });

    it("should throw error when invalid param provided for VPC", () => {
        const app = new TestApp();
        const stack = new TestStack(app);
        expect(() => {
            RGNodejsFunctionPropsValidator.parse({
                entry: "test",
                reservedConcurrentExecutions: 10,
                allowAllOutbound: false,
                deadLetterQueueEnabled: true,
                deadLetterQueue: new Queue(stack, "test"),
                vpc: {},
            });
        }).toThrowErrorMatchingInlineSnapshot(`
            "[
              {
                "expected": "string",
                "code": "invalid_type",
                "path": [
                  "vpc",
                  "vpcId"
                ],
                "message": "Invalid input: expected string, received undefined"
              }
            ]"
        `);
    });
});
