import { HttpApi, HttpApiProps, IHttpStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { CfnStage } from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";
import { findRGStackAncestor } from "../utils/constructs";
import { AccessLogFormat, LogGroupLogDestination } from "aws-cdk-lib/aws-apigateway";
import { RGLogGroup } from "../RGLogGroup";
import { RGHttpApiPropsValidator } from "./RGHttpApiPropsValidator";

export interface RGHttpApiProps extends Omit<HttpApiProps, "createDefaultStage"> {
    throttlingBurstLimit?: number;
    throttlingRateLimit?: number;
}

export class RGHttpApi extends HttpApi {
    readonly defaultStage: IHttpStage | undefined;

    constructor(scope: Construct, id: string, userProps?: HttpApiProps) {
        const stack = findRGStackAncestor(scope);

        if (!stack) throw new Error("RGHttpApi must be used within an RGStack");

        const defaultProps: RGHttpApiProps & { createDefaultStage: boolean } = {
            throttlingBurstLimit: 10,
            throttlingRateLimit: 10,
            ...userProps,
            createDefaultStage: false,
        };

        RGHttpApiPropsValidator.parse(defaultProps);

        super(scope, id, defaultProps);

        this.defaultStage = this.addStage("default", {
            autoDeploy: true,
            stageName: "$default",
        });

        const logGroup = new RGLogGroup(scope, `${id}-access-logs`);
        const cfnStage = this.defaultStage.node.defaultChild as CfnStage;
        cfnStage.defaultRouteSettings = {
            throttlingBurstLimit: 10,
            throttlingRateLimit: 10,
        };
        cfnStage.accessLogSettings = {
            destinationArn: logGroup.logGroupArn,
            format: '{"requestId":"$context.requestId","ip":"$context.identity.sourceIp","user":"$context.identity.user","caller":"$context.identity.caller","requestTime":"$context.requestTime","httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath","status":"$context.status","protocol":"$context.protocol","responseLength":"$context.responseLength"}',
        };
    }
}
