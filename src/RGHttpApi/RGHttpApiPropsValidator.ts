import * as zod from "zod";

export const RGHttpApiPropsValidator = zod
    .object({
        createDefaultStage: zod.boolean(),
        throttlingBurstLimit: zod.number().min(1),
        throttlingRateLimit: zod.number().min(1),
    })
    .required();
