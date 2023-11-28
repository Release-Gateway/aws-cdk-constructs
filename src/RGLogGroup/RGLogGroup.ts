import { RemovalPolicy } from "aws-cdk-lib";
import { LogGroup, LogGroupProps, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { findRGStackAncestor } from "../utils/constructs";

export interface RGLogGroupProps extends LogGroupProps {}

export class RGLogGroup extends LogGroup {
    constructor(scope: Construct, id: string, props: RGLogGroupProps) {
        const stack = findRGStackAncestor(scope);

        if (!stack) throw new Error("RGLogGroup must be used within an RGStack");

        const defaultProps: Partial<RGLogGroupProps> = {
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_WEEK,
            encryptionKey: stack.kmsKey,
        };

        super(scope, id, {
            ...defaultProps,
            ...props,
        });
    }
}
