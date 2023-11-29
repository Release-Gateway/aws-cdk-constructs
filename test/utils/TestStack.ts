import { RGStack, RGStackProps } from "../../src/RGStack/RGStack";
import { RGApp } from "../../src";

export class TestStack extends RGStack {
    constructor(
        scope: RGApp,
        id = "test-stack",
        props: RGStackProps = {
            serviceName: "test-service",
            version: "1.0.0",
        }
    ) {
        super(scope, id, props);
    }
}
