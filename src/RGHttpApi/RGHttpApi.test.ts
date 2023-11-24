import { TestApp } from "../testing/TestApp";
import { TestStack } from "../testing/TestStack";
import { RGHttpApi } from "./RGHttpApi";

describe("RGHttpApi", () => {
    it("should be compliant with cloud standards", () => {
        const app = new TestApp();
        const stack = new TestStack(app);
        new RGHttpApi(stack, "test-http-api", {});

        expect(app.isCompliantWithCloudStandards()).toBe(true);
    });
});
