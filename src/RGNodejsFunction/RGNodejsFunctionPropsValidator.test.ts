import { RGNodejsFunctionPropsValidator } from "./RGNodejsFunctionPropsValidator";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { TestApp } from "../../tests/utils/TestApp";
import { TestStack } from "../../tests/utils/TestStack";

describe("RGNodejsFunctionPropsValidator", () => {
    it("should throw expected validation errors", () => {
        expect(() => {
            RGNodejsFunctionPropsValidator.parse({});
        }).toThrowErrorMatchingInlineSnapshot(`
            "[
              {
                "code": "invalid_type",
                "expected": "number",
                "received": "undefined",
                "path": [
                  "reservedConcurrentExecutions"
                ],
                "message": "Required"
              },
              {
                "code": "invalid_type",
                "expected": "boolean",
                "received": "undefined",
                "path": [
                  "allowAllOutbound"
                ],
                "message": "Required"
              },
              {
                "code": "invalid_type",
                "expected": "boolean",
                "received": "undefined",
                "path": [
                  "deadLetterQueueEnabled"
                ],
                "message": "Required"
              },
              {
                "code": "custom",
                "message": "Input not instance of Queue",
                "fatal": true,
                "path": [
                  "deadLetterQueue"
                ]
              },
              {
                "code": "invalid_type",
                "expected": "string",
                "received": "undefined",
                "path": [
                  "entry"
                ],
                "message": "Required"
              },
              {
                "code": "invalid_type",
                "expected": "object",
                "received": "undefined",
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
                "code": "invalid_type",
                "expected": "string",
                "received": "undefined",
                "path": [
                  "vpc",
                  "vpcId"
                ],
                "message": "Required"
              }
            ]"
        `);
    });
});
