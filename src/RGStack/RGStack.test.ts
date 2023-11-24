import { RGStack } from "./RGStack";
import { RGApp } from "../RGApp/RGApp";

describe("RGStack", () => {
    let originalEnv: unknown;
    beforeAll(() => {
        originalEnv = process.env["NODE_ENV"];
        process.env["NODE_ENV"] = "dev123";
    });
    afterAll(() => {
        process.env["NODE_ENV"] = originalEnv as string;
    });

    it("should instantiate without error", () => {
        expect(() => {
            const app = new RGApp();
            new RGStack(app, "RGStack", {
                serviceName: "test",
                version: "1.0.0",
            });
        }).not.toThrow();
    });

    it("should set default tags", () => {
        const app = new RGApp();
        const stack = new RGStack(app, "RGStack", {
            version: "1.0.0",
            serviceName: "test",
        });
        expect(stack.tags.tagValues()).toMatchInlineSnapshot(`
      {
        "environment": "dev123",
        "release-gateway:aws-cdk-construct-version": "0.0.0",
        "serviceName": "test",
        "version": "1.0.0",
      }
    `);
    });
});
