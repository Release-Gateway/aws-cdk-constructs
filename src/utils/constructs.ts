import { Construct } from "constructs";
import { RGStack } from "../RGStack/RGStack";

/**
 * Find the RGStack ancestor of a construct
 * @param scope
 */
export function findRGStackAncestor(scope: Construct): RGStack | undefined {
    return scope.node.scopes.find((ancestor: unknown) => ancestor instanceof RGStack) as RGStack;
}
