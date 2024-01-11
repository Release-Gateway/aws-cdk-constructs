![Release Gateway](https://raw.githubusercontent.com/Release-Gateway/aws-cdk-constructs/master/logo.png)

# AWS CDK Constructs

[![npm version](https://badge.fury.io/js/@release-gateway%2Faws-cdk-constructs.svg)](https://www.npmjs.com/package/@release-gateway/aws-cdk-constructs) [![CI](https://github.com/Release-Gateway/aws-cdk-constructs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Release-Gateway/aws-cdk-constructs/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/Release-Gateway/aws-cdk-constructs/graph/badge.svg?token=QI7BVOB3SA)](https://codecov.io/gh/Release-Gateway/aws-cdk-constructs)

Library of Enterprise ready CDK constructs that are standards compliant with the [CIS 1.4](https://docs.aws.amazon.com/audit-manager/latest/userguide/CIS-1-4.html), [NIST 800-53 Rev5](https://docs.aws.amazon.com/securityhub/latest/userguide/nist-standard.html) and adopting the best practices set out in AWS Well Architected [Reliability](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html) and [Security](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) Pillars.

This library follows the AWS CDK L1, L2, L3 paradigms and where possible applies the minimum configuration needed to satisfy the cloud standards.

## Why does this exist?

[AWS CDK]([url](https://aws.amazon.com/cdk/)) is amazing but out of the box it does not enforce any cloud standards for security, reliability etc for the infrastructure it deploys.  With the [AWS shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/)), the cloud is secure but it is your responsonsibility to be secure _in_ the cloud.

Given AWS' vast surface area and configurability, this responsibility of deploying software can be daunting, leading many engineers to shy away from getting involved in infrustructure.

The goal of this repo is to provide native AWS CDK construct alternatives that are cloud standards compliant by default. The hope is that this lowers the barrier to entry for application engineers to get involved in managing and deploying their own infrastructure as code, since the building blocks they are using are known to be standards compliant.

Additionally, this repo provides a validator you can wire into your CDK Apps, which lets engineers ensure that _the way_ CDK constructs have been assembled and wired together is compliant.

This result in secure cloud applications with application engineers able to own their infrastructure safely. Win!

## How does it work?

We use policy-as-code tools such as [Cloudformation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) to determine whether default constructs such as `Function`, `ApiGateway`, `SecurityGroups`, `DynamoDB` (and many more) are compliant out of the box.  

If they are not compliant by default, we create an equivalent CDK class construct that _inherits_ from the AWS construct and implements the necessary config changes to nudge the resulting infrastructure into compliance.

For example, some cloud standards require Cloudwatch Log Groups to be encrypted.  So for our `RGLogGroup` equivalent, we configure the encryption for you under the hood, but you can still use the CDK `RGLogGroup` construct in exactly the same way as `LogGroup` since one inherits from the other.

## Installation

Use the package manager npm to install this package:

```bash
npm install @release-gateway/aws-cdk-constructs
```

## Usage

```typescript
import { RGApp, RGStack, RGStackProps } from "@release-gateway/aws-cdk-constructs"

class MyStackStack extends RGStack {
  constructor(scope: RGApp, id: string, props: RGStackProps) {
    super(scope, id, props);
    // Define your stack...
  }
}

// Build and synthesize
const app = new RGApp();
new MyStack(app, "my-stack", {
  serviceName: "My Service Name",
  version: "1.0.0"
})
app.synth()

```

## Constructs

| Construct name   | Base class        | Description of changes                                                                                                                               |
|:-----------------|:------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------|
| RGApp            | App               | Includes RGGuardValidator as policy validator                                                                                                        |
| RGStack          | Stack             | Adds standard tags and creates shared KMS key for use by child resources                                                                             |
| RGGuardValidator | CfnGuardValidator | Policy validator configured to enforce CIS 1.4, NIST800-Rev53, Well Architecte Reliabilty Pillar and Well Architected Security Pillar best practices |
| RGLogGroup       | LogGroup          | Applies kms log encryption, removal policy and sets retention to 1 week                                                                              |
| RGNodejsFunction | NodejsFunction    | Makes VPC mandatory, creates lambda log group with encryption, configures DLQ and sets removal policy                                                |
| RGQueue          | Queue             | Sets KMS encryption, removal policy and configures DLQ                                                                                               |
| RGTable          | TableV2           | Sets KMS encryption,, removal policy                                                                                                                 |
| RGHttpApi        | HttpApi           | Sets encrypted access logging and throttling defaults                                                                                                |
| RGRestApi        | RestApi           | Sets encrypted access and execution logging, throttling defaults, regional endpoint type                                                             |

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Attribution

Logo Icons
- Rocket by Gregor Cresnar from [Noun Project](https://thenounproject.com/browse/icons/term/rocket/) (CC BY 3.0)
- Checklist by Kartika Sholehatin from [Noun Project](https://thenounproject.com/browse/icons/term/checklist/) (CC BY 3.0)
- Code by Adiyogi from [Noun Project](https://thenounproject.com/browse/icons/term/code/) (CC BY 3.0)
