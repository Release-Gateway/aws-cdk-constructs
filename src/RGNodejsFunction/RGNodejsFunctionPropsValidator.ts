import * as zod from "zod";
import { Queue } from "aws-cdk-lib/aws-sqs";

export const RGNodejsFunctionPropsValidator = zod
    .object({
        reservedConcurrentExecutions: zod.number().int().min(1),
        allowAllOutbound: zod.boolean(),
        deadLetterQueueEnabled: zod.boolean(),
        deadLetterQueue: zod.instanceof(Queue),
        entry: zod.string(),
        vpc: zod
            .object(
                {
                    vpcId: zod.string(),
                },
                {
                    message: "Constructor property `vpc` is required.",
                }
            )
            .required(),
    })
    .required();
