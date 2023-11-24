import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { RGQueue } from "../RGQueue/RGQueue";
import { RGLogGroup } from "../RGLogGroup/RGLogGroup";

export interface RGNodejsFunctionProps extends NodejsFunctionProps {
    vpc: IVpc;
}

export class RGNodejsFunction extends NodejsFunction {
    constructor(scope: Construct, id: string, props: RGNodejsFunctionProps) {
        const defaultProps: Partial<RGNodejsFunctionProps> = {
            reservedConcurrentExecutions: 10,
            deadLetterQueueEnabled: true,
            deadLetterQueue: new RGQueue(scope, `${id}-dlq`, { isDeadLetterQueue: true }),
        };

        super(scope, id, {
            ...defaultProps,
            ...props,
        });

        new RGLogGroup(this, `logs`, {
            logGroupName: `/aws/lambda/${this.functionName}`,
        });
    }
}
