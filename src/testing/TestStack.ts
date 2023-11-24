import { RGStack, RGStackProps } from "../RGStack/RGStack";
import { Construct } from "constructs";

export class TestStack extends RGStack {
    constructor(
        scope: Construct,
        id = "test-stack",
        props: RGStackProps = {
            serviceName: "test-service",
            version: "1.0.0",
        }
    ) {
        super(scope, id, props);
    }
}
