import { RGApp } from "../../src";
import { KitchenSinkStack } from "./KitchenSinkStack";
import { getEnv } from "aws-cdk-lib/custom-resources/lib/provider-framework/runtime/util";

const app = new RGApp();
new KitchenSinkStack(app, "kitchen-sink", {
    serviceName: "kitchen-sink",
    version: "v1",
    env: {
        region: getEnv("AWS_REGION"),
        account: getEnv("AWS_ACCOUNT_ID"),
    },
});
app.synth();
