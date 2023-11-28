import { Queue, QueueEncryption, QueueProps } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { findRGStackAncestor } from "../utils/constructs";
import { RemovalPolicy } from "aws-cdk-lib/core";

export interface RGQueueProps extends QueueProps {
    isDeadLetterQueue?: boolean;
}

/**
 * Standards Compliant SQS Queue
 */
export class RGQueue extends Queue {
    constructor(scope: Construct, id: string, props?: RGQueueProps) {
        const stack = findRGStackAncestor(scope);

        if (!stack) throw new Error("RGLogGroup must be used within an RGStack");

        // @todo: Fix this type. This is here because using QueueProps gives a readonly error
        const defaultProps: Partial<Record<keyof QueueProps, unknown>> = {
            removalPolicy: RemovalPolicy.DESTROY,
            encryptionMasterKey: stack.kmsKey,
            encryption: QueueEncryption.KMS,
        };

        // If this is _NOT_ a dead letter queue, we need to create a dead letter queue
        if (props?.isDeadLetterQueue !== true) {
            defaultProps.deadLetterQueue = {
                maxReceiveCount: 3,
                queue: new RGQueue(scope, `${id}-dlq`, { isDeadLetterQueue: true }),
            };
        }

        super(scope, id, {
            ...(defaultProps as QueueProps),
            ...props,
        });
    }
}
