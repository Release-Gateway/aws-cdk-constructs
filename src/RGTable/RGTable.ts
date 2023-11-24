import { TableEncryptionV2, TablePropsV2, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import { findRGStackAncestor } from "../utils/constructs";

export interface RGTableProps extends TablePropsV2 {}

export class RGTable extends TableV2 {
    constructor(scope: Construct, id: string, props: RGTableProps) {
        const stack = findRGStackAncestor(scope);
        const defaultProps: Partial<RGTableProps> = {
            removalPolicy: RemovalPolicy.DESTROY,
            encryption: stack ? TableEncryptionV2.customerManagedKey(stack.kmsKey) : undefined,
        };

        super(scope, id, {
            ...defaultProps,
            ...props,
        });
    }
}
