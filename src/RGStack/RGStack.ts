import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { getEnv, getVersion } from "../utils/environment";
import { Key } from "aws-cdk-lib/aws-kms";
import { RGStackPropValidator } from "./RGStackPropValidator";
import { RGApp } from "../RGApp";

export interface RGStackProps extends StackProps {
    serviceName: string;
    version: string;
}

export class RGStack extends Stack {
    kmsKey: Key;

    constructor(scope: RGApp, id: string, props: RGStackProps) {
        RGStackPropValidator.parse(props);

        super(scope, id, props);

        const envName = getEnv("NODE_ENV");

        this.tags.setTag("environment", envName);
        this.tags.setTag("service-name", props.serviceName);
        this.tags.setTag("version", props.version);
        this.tags.setTag("stack-name", this.stackName);
        this.tags.setTag("release-gateway:aws-cdk-construct-version", getVersion());

        this.kmsKey = new Key(this, "stack-key", {
            removalPolicy: RemovalPolicy.DESTROY,
            enableKeyRotation: true,
        });

        // Aspects.of(this).add(new LogGroupDependencyAspect(this));
    }
}
