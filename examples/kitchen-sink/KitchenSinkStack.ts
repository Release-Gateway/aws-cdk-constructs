import { RGApp, RGLogGroup, RGNodejsFunction, RGQueue, RGStack, RGStackProps } from "../../src";
import { RGHttpApi } from "../../src/RGHttpApi/RGHttpApi";
import { HttpUrlIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { join } from "path";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { RGRestApi } from "../../src/RGRestApi/RGRestApi";
import { HttpIntegration } from "aws-cdk-lib/aws-apigateway";
import { RGTable } from "../../src/RGTable";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { getEnv } from "../../src/utils/environment";

export class KitchenSinkStack extends RGStack {
    constructor(app: RGApp, id: string, props: RGStackProps) {
        super(app, id, props);

        new RGLogGroup(this, "test-log-group");
        const http = new RGHttpApi(this, "test-http-api");
        http.addRoutes({
            path: "/",
            methods: [HttpMethod.GET],
            integration: new HttpUrlIntegration(
                "test-integration",
                "https://jsonplaceholder.typicode.com/posts"
            ),
        });
        new RGNodejsFunction(this, "test-nodejs-function", {
            entry: join(__dirname, "../../tests/utils/test-handler.ts"),
            vpc: Vpc.fromLookup(this, "vpc", { vpcId: getEnv("VPC_ID") }),
        });
        new RGQueue(this, "test-queue");
        const api = new RGRestApi(this, "test-rest-api");
        api.root.addMethod(
            HttpMethod.GET,
            new HttpIntegration("https://jsonplaceholder.typicode.com/posts", {
                proxy: true,
            })
        );
        new RGTable(this, "test-table", {
            partitionKey: {
                name: "pk",
                type: AttributeType.STRING,
            },
        });
    }
}
