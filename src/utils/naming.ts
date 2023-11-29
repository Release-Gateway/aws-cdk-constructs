import camelCase from "lodash/camelCase";
import upperFirst from "lodash/upperFirst";

export function lambdaFunctionName(desiredName: string) {
    return desiredName
        .split("/")
        .map((part) => upperFirst(camelCase(part)))
        .join("_");
}

export function queueName(desiredName: string) {
    return desiredName
        .split("/")
        .map((part) => upperFirst(camelCase(part)))
        .join("_");
}
