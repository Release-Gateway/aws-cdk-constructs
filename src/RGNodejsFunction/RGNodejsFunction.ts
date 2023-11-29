import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { RGQueue } from "../RGQueue";
import { RGLogGroup } from "../RGLogGroup";
import { RGNodejsFunctionPropsValidator } from "./RGNodejsFunctionPropsValidator";
import { lambdaFunctionName } from "../utils/naming";

export interface RGNodejsFunctionProps extends NodejsFunctionProps {}

export class RGNodejsFunction extends NodejsFunction {
    constructor(scope: Construct, id: string, userProps: RGNodejsFunctionProps) {
        if (!userProps.vpc) throw new Error("Constructor property `vpc` is required");

        const defaultProps: Partial<NodejsFunctionProps> = {
            reservedConcurrentExecutions: 10,
            allowAllOutbound: false,
            deadLetterQueueEnabled: true,
            deadLetterQueue: new RGQueue(scope, `${id}-dlq`, {
                isDeadLetterQueue: true,
                queueName: `${scope.node.path}/${id}/dlq`,
            }),
            ...userProps,
            functionName: lambdaFunctionName(userProps.functionName || `${scope.node.path}/${id}`),
        };

        const mergedProps: NodejsFunctionProps = {
            ...defaultProps,
        };

        RGNodejsFunctionPropsValidator.parse(mergedProps);

        super(scope, id, mergedProps);

        new RGLogGroup(this, `logs`, {
            logGroupName: `/aws/lambda/${defaultProps.functionName}`,
        });
    }
}
