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
        // @todo: Fix this type. This is here because using QueueProps gives a readonly error
        const defaultProps: Partial<Record<keyof QueueProps, unknown>> = {
            removalPolicy: RemovalPolicy.DESTROY,
        };

        // If this is _NOT_ a dead letter queue, we need to create a dead letter queue
        if (props?.isDeadLetterQueue !== true) {
            defaultProps.deadLetterQueue = {
                maxReceiveCount: 3,
                queue: new RGQueue(scope, `${id}-dlq`, { isDeadLetterQueue: true }),
            };
        }

        // If we have a RGStack ancestor, we can use its KMS key for encryption
        if (stack) {
            defaultProps.encryptionMasterKey = stack.kmsKey;
            defaultProps.encryption = QueueEncryption.KMS;
        } else {
            // Else we use the default SQS KMS key
            defaultProps.encryption = QueueEncryption.KMS_MANAGED;
        }

        super(scope, id, {
            ...(defaultProps as QueueProps),
            ...props,
        });
    }
}
