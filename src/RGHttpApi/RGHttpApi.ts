import { HttpApi, HttpApiProps } from "@aws-cdk/aws-apigatewayv2-alpha";
import { Construct } from "constructs";

export interface RGHttpApiProps extends HttpApiProps {}

const defaultProps: RGHttpApiProps = {};

export class RGHttpApi extends HttpApi {
    constructor(scope: Construct, id: string, userProps: HttpApiProps = {}) {
        super(scope, id, {
            ...defaultProps,
            ...userProps,
        });
    }
}
