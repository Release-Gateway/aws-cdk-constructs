import { HttpApi, HttpApiProps, IHttpStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { CfnStage } from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";
import { findRGStackAncestor } from "../utils/constructs";
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

        const logGroup = new RGLogGroup(this, `access-logs`);
        const cfnStage = this.defaultStage.node.defaultChild as CfnStage;
        cfnStage.defaultRouteSettings = {
            throttlingBurstLimit: 10,
            throttlingRateLimit: 10,
        };
        cfnStage.accessLogSettings = {
            destinationArn: logGroup.logGroupArn,
            format: '{"requestTime":"$context.requestTime","requestId":"$context.requestId","httpMethod":"$context.httpMethod","path":"$context.path","routeKey":"$context.routeKey","status":$context.status,"responseLatency":$context.responseLatency,"integrationRequestId":"$context.integration.requestId","functionResponseStatus":"$context.integration.status","integrationLatency":"$context.integration.latency","integrationServiceStatus":"$context.integration.integrationStatus","ip":"$context.identity.sourceIp","userAgent":"$context.identity.userAgent","principalId":"$context.authorizer.principalId"}',
        };
    }
}
