import { Construct } from "constructs";
import { IVpc, Vpc } from "aws-cdk-lib/aws-ec2";

/**
 * Create fake VPC for testing purposes
 * @param scope
 * @param id
 */
export function testVpc(scope: Construct, id = "vpc"): IVpc {
    return Vpc.fromVpcAttributes(scope, id, {
        vpcId: "vpc-123456789",
        availabilityZones: ["zone-1", "zone-2"],
        publicSubnetIds: ["subnet-1", "subnet-2"],
        isolatedSubnetIds: ["subnet-3", "subnet-4"],
        privateSubnetIds: ["subnet-5", "subnet-6"],
        vpcCidrBlock: "10.0.0.0/8",
    });
}
