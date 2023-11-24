import { TestApp } from "../testing/TestApp";
import { RGLogGroup } from "./RGLogGroup";
import { TestStack } from "../testing/TestStack";

describe("RGLogGroup", () => {
    it("should be compliant with cloud standards", () => {
        const app = new TestApp();
        const stack = new TestStack(app);
        new RGLogGroup(stack, "test-log-group", {});

        expect(app.isCompliantWithCloudStandards()).toBe(true);
    });
});
