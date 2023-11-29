import { RemovalPolicy } from "aws-cdk-lib";
import { LogGroup, LogGroupProps, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { findRGStackAncestor } from "../utils/constructs";
import { PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export interface RGLogGroupProps extends LogGroupProps {}

export class RGLogGroup extends LogGroup {
    constructor(scope: Construct, id: string, props: RGLogGroupProps = {}) {
        const stack = findRGStackAncestor(scope);

        if (!stack) throw new Error("RGLogGroup must be used within an RGStack");

        const defaultProps: Partial<RGLogGroupProps> = {
            logGroupName: props.logGroupName || `${scope.node.path}/${id}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_WEEK,
            encryptionKey: stack.kmsKey,
        };

        super(scope, id, {
            ...defaultProps,
            ...props,
        });

        stack.kmsKey.addToResourcePolicy(
            new PolicyStatement({
                principals: [new ServicePrincipal(`logs.${this.stack.region}.amazonaws.com`)],
                resources: ["*"],
                actions: [
                    "kms:Encrypt*",
                    "kms:Decrypt*",
                    "kms:ReEncrypt*",
                    "kms:GenerateDataKey*",
                    "kms:Describe*",
                ],
                conditions: {
                    ArnLike: {
                        "kms:EncryptionContext:aws:logs:arn": `arn:aws:logs:${this.stack.region}:${this.stack.account}:log-group:${defaultProps.logGroupName}`,
                    },
                },
            })
        );
    }
}
