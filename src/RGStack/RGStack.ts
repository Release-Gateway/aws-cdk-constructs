import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getEnv, getVersion } from "../utils/environment";
import { Key } from "aws-cdk-lib/aws-kms";
import { Bucket } from "aws-cdk-lib/aws-s3";

export interface RGStackProps extends StackProps {
    serviceName: string;
    version: string;
}

export class RGStack extends Stack {
    kmsKey: Key;

    constructor(scope: Construct, id: string, props: RGStackProps) {
        super(scope, id, props);

        Bucket;

        this.tags.setTag("environment", getEnv("NODE_ENV"));
        this.tags.setTag("serviceName", props.serviceName);
        this.tags.setTag("version", props.version);
        this.tags.setTag("release-gateway:aws-cdk-construct-version", getVersion());

        this.kmsKey = new Key(this, "stack-key", {
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }
}
