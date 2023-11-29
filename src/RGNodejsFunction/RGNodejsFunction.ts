import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { RGQueue } from "../RGQueue";
import { RGLogGroup } from "../RGLogGroup";
import { RGNodejsFunctionPropsValidator } from "./RGNodejsFunctionPropsValidator";
import { lambdaFunctionName } from "../utils/naming";

export interface RGNodejsFunctionProps extends NodejsFunctionProps {
    vpc: IVpc;
    entry: string;
}

export class RGNodejsFunction extends NodejsFunction {
    constructor(scope: Construct, id: string, props: RGNodejsFunctionProps) {
        const defaultProps: Partial<NodejsFunctionProps> = {
            reservedConcurrentExecutions: 10,
            allowAllOutbound: false,
            deadLetterQueueEnabled: true,
            deadLetterQueue: new RGQueue(scope, `${id}-dlq`, {
                isDeadLetterQueue: true,
                queueName: `${scope.node.path}/${id}/dlq`,
            }),
            ...props,
            functionName: lambdaFunctionName(props.functionName || `${scope.node.path}/${id}`),
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
