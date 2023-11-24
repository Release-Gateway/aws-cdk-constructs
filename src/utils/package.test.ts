import { getPackageProperty } from "./package";

describe("Package utils", () => {
    describe("#getPackageProperty", () => {
        it("should return the property value if it exists", () => {
            expect(getPackageProperty("name")).toEqual("@release-gateway/aws-cdk-constructs");
        });
        it("should return undefined if the property does not exist", () => {
            expect(getPackageProperty("doesnt exist" as "name")).toEqual(undefined);
        });
    });
});
