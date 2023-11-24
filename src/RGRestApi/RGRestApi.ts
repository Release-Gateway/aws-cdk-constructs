import { Construct } from "constructs";
import { RestApi, RestApiProps } from "aws-cdk-lib/aws-apigateway";

export interface RGRestApiProps extends RestApiProps {}

const defaultProps: RGRestApiProps = {};

export class RGRestApi extends RestApi {
    constructor(scope: Construct, id: string, userProps: RGRestApiProps = {}) {
        super(scope, id, {
            ...defaultProps,
            ...userProps,
        });
    }
}
