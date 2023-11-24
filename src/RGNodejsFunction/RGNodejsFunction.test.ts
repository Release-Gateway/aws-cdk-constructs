import { TestApp } from "../testing/TestApp";
import { RGNodejsFunction } from "./RGNodejsFunction";
import { join } from "path";
import { testVpc } from "../testing/vpc";
import { TestStack } from "../testing/TestStack";

describe("RGNodejsFunction", () => {
    it("should be compliant with cloud standards", () => {
        const app = new TestApp();
        const stack = new TestStack(app);
        new RGNodejsFunction(stack, "test-function", {
            entry: join(__dirname, "../testing/test-handler.ts"),
            vpc: testVpc(stack, "vpc"),
        });

        expect(app.isCompliantWithCloudStandards()).toBe(true);
    });
});
