import * as zod from "zod";

export const RGStackPropValidator = zod
    .object({
        serviceName: zod
            .string({
                required_error: "Constructor property `serviceName` is required.",
            })
            .min(1),
        version: zod
            .string({
                required_error: "Constructor property `version` is required.",
            })
            .min(1),
    })
    .required();
