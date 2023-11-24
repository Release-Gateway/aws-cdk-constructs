# Release Gateway AWS CDK Constructs

Library of Enterprise ready CDK constructs that are standards compliant with the [CIS 1.4](https://docs.aws.amazon.com/audit-manager/latest/userguide/CIS-1-4.html), [NIST 800-53 Rev5](https://docs.aws.amazon.com/securityhub/latest/userguide/nist-standard.html) and adopting the best practices set out in AWS Well Architected [Reliability](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html) and [Security](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) Pillars.

This library follows the AWS CDK L1, L2, L3 paradigms and where possible applies the minimum configuration needed to satisfy the cloud standards.

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

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

| Construct name     | Base class        | Description of changes                                                                                                                               |
|:-------------------|:------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------|
| RGApp              | App               | Includes RGGuardValidator as policy validator                                                                                                        |
| RGStack            | Stack             | Adds standard tags and creates shared KMS key for use by child resources                                                                             |
| RGGuardValidator   | CfnGuardValidator | Policy validator configured to enforce CIS 1.4, NIST800-Rev53, Well Architecte Reliabilty Pillar and Well Architected Security Pillar best practices |
| RGLogGroup         | LogGroup          | Applies kms log encryption, removal policy and sets retention to 1 week                                                                              |
| RGNodejsFunction   | NodejsFunction    | Makes VPC mandatory, creates lambda log group with encryption, configures DLQ and sets removal policy                                                |
| RGQueue            | Queue             | Sets KMS encryption, removal policy and configures DLQ                                                                                               |


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
