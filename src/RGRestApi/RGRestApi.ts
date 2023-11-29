import { Construct } from "constructs";
import {
    AccessLogFormat,
    EndpointType,
    LogGroupLogDestination,
    MethodLoggingLevel,
    RestApi,
    RestApiProps,
} from "aws-cdk-lib/aws-apigateway";
import { RGLogGroup } from "../RGLogGroup";
import { findRGStackAncestor } from "../utils/constructs";

export interface RGRestApiProps extends RestApiProps {}

export class RGRestApi extends RestApi {
    constructor(scope: Construct, id: string, userProps?: RGRestApiProps) {
        const stack = findRGStackAncestor(scope);

        if (!stack) throw new Error("RGRestApi must be used within an RGStack");

        const defaultProps: RGRestApiProps = {
            deployOptions: {
                accessLogFormat: AccessLogFormat.custom(
                    '{"requestTime":"$context.requestTime","requestId":"$context.requestId","httpMethod":"$context.httpMethod","path":"$context.path","resourcePath":"$context.resourcePath","status":$context.status,"responseLatency":$context.responseLatency,"xrayTraceId":"$context.xrayTraceId","integrationRequestId":"$context.integration.requestId","functionResponseStatus":"$context.integration.status","integrationLatency":"$context.integration.latency","integrationServiceStatus":"$context.integration.integrationStatus","ip":"$context.identity.sourceIp","userAgent":"$context.identity.userAgent"}'
                ),
                accessLogDestination: new LogGroupLogDestination(
                    new RGLogGroup(scope, `${id}-access-logs`, {
                        logGroupName: `${scope.node.path}/${id}/access-logs`,
                    })
                ),
                throttlingBurstLimit: 10,
                throttlingRateLimit: 10,
                loggingLevel: MethodLoggingLevel.INFO,
            },
            deploy: true,
            endpointConfiguration: {
                types: [EndpointType.REGIONAL],
            },
        };

        super(scope, id, {
            ...defaultProps,
            ...userProps,
        });
    }
}
