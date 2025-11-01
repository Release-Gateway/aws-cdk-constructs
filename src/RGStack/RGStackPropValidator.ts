import * as zod from "zod";

export const RGStackPropValidator = zod
    .object({
        serviceName: zod
            .string({
                message: "Constructor property `serviceName` is required.",
            })
            .min(1),
        version: zod
            .string({
                message: "Constructor property `version` is required.",
            })
            .min(1),
    })
    .required();
