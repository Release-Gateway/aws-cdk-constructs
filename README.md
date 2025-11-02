![Release Gateway](https://raw.githubusercontent.com/Release-Gateway/aws-cdk-constructs/master/logo.png)

# AWS CDK Constructs

[![npm version](https://badge.fury.io/js/@release-gateway%2Faws-cdk-constructs.svg)](https://www.npmjs.com/package/@release-gateway/aws-cdk-constructs) [![CI](https://github.com/Release-Gateway/aws-cdk-constructs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Release-Gateway/aws-cdk-constructs/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/Release-Gateway/aws-cdk-constructs/graph/badge.svg?token=QI7BVOB3SA)](https://codecov.io/gh/Release-Gateway/aws-cdk-constructs)

> Enterprise-ready AWS CDK constructs that are compliant with [CIS 1.4](https://docs.aws.amazon.com/audit-manager/latest/userguide/CIS-1-4.html), [NIST 800-53 Rev5](https://docs.aws.amazon.com/securityhub/latest/userguide/nist-standard.html), and AWS Well-Architected [Reliability](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html) and [Security](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) best practices by default.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Why Use This Library?](#why-use-this-library)
- [How It Works](#how-it-works)
- [Adoption Strategy](#adoption-strategy)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Available Constructs](#available-constructs)
- [Examples](#examples)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)
- [Attribution](#attribution)

## About

This library provides drop-in replacements for standard AWS CDK constructs that automatically apply security and reliability best practices. Built following the AWS CDK L1, L2, and L3 paradigms, these constructs require minimal configuration while ensuring compliance with enterprise cloud standards.

## Features

✨ **Security by Default** - All constructs enforce encryption, secure configurations, and compliance standards out of the box

🛡️ **Universal Compliance Validation** - `RGApp` validates ALL child constructs for compliance, whether they're from this library, native AWS CDK, or your own custom constructs

🔄 **Drop-in Replacements** - Extend native CDK constructs, so you can use them with familiar APIs and patterns

📋 **Multi-Standard Compliance** - Meets CIS 1.4, NIST 800-53 Rev5, and AWS Well-Architected Framework requirements

🚀 **Incremental Adoption** - Start with just `RGApp` for visibility, then migrate constructs at your own pace—no need for a full rewrite

## Why Use This Library?

[AWS CDK](https://aws.amazon.com/cdk/) is a powerful infrastructure-as-code framework, but it doesn't enforce security, reliability, or compliance standards by default. According to the [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/), while AWS secures the cloud infrastructure, you're responsible for security _in_ the cloud.

Given AWS's vast surface area and configurability, deploying secure, compliant infrastructure can be daunting. This often leads engineers to avoid infrastructure management altogether.

**This library solves these challenges by providing:**

- **Standards-compliant building blocks** that work like native CDK constructs
- **Built-in validation** to ensure your infrastructure assembly is compliant
- **Reduced cognitive load** so engineers can focus on business logic, not security configurations

The result: secure cloud applications with application engineers confidently owning their infrastructure. Win! 🎉

## How It Works

We use policy-as-code tools like [CloudFormation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) to verify whether default CDK constructs such as `Function`, `ApiGateway`, `SecurityGroup`, and `DynamoDB` are compliant out of the box.

When default constructs don't meet compliance standards, we create equivalent CDK constructs that **inherit** from the AWS construct and automatically apply the necessary configurations to achieve compliance.

**Example:** Some cloud standards require CloudWatch Log Groups to be encrypted. Our `RGLogGroup` construct automatically configures encryption for you, but you can use it exactly like the native CDK `LogGroup` construct since one inherits from the other.

```typescript
// Instead of:
import { LogGroup } from 'aws-cdk-lib/aws-logs';

// Use:
import { RGLogGroup } from '@release-gateway/aws-cdk-constructs';
```

The API remains familiar, but compliance is built in.

## Adoption Strategy

**You don't need to rewrite your entire infrastructure to benefit from this library.** The beauty of this approach is its flexibility—adopt at your own pace.

### Start with Just RGApp

The fastest way to gain compliance visibility is to simply replace `App` with `RGApp` in your existing CDK application:

```typescript
// Before
import { App } from 'aws-cdk-lib';
const app = new App();

// After - instant compliance validation for ALL your constructs
import { RGApp } from '@release-gateway/aws-cdk-constructs';
const app = new RGApp();
```

**This single change validates your entire stack**, including:
- Native AWS CDK constructs (`Function`, `Bucket`, `Table`, etc.)
- Custom constructs you've built
- Third-party constructs from other libraries
- Constructs from this library

You'll immediately see which resources are compliant and which need attention—**without changing a single line of infrastructure code**.

#### Customize Compliance Frameworks

By default, `RGApp` validates against CIS AWS Benchmark Level 2, NIST 800-53 Rev5, and AWS Well-Architected Reliability & Security Pillars. You can customize this:

```typescript
import { RGApp, ComplianceFramework } from '@release-gateway/aws-cdk-constructs';

// Validate against specific frameworks only
const app = new RGApp({
  compliance: [
    ComplianceFramework.HIPAA_SECURITY,
    ComplianceFramework.PCI_DSS_3_2_1,
    ComplianceFramework.FEDRAMP_MODERATE
  ]
});
```

#### Control Error Handling

By default, compliance violations will fail CDK synthesis. During migration or for reporting-only use cases, you can change this behavior:

```typescript
// Report violations but don't fail synthesis
const app = new RGApp({
  throwErrorOnComplianceFail: false
});
```

This is particularly useful when gradually adopting compliance standards, as it provides visibility without blocking deployments.

### Mix and Match Constructs

As you identify non-compliant resources, you can incrementally replace them with compliant equivalents from this library:

```typescript
import { RGApp, RGStack, RGLogGroup } from '@release-gateway/aws-cdk-constructs';
import { Function } from 'aws-cdk-lib/aws-lambda'; // Native CDK construct
import { Bucket } from 'aws-cdk-lib/aws-s3';       // Native CDK construct

const app = new RGApp(); // Validates everything

class MyStack extends RGStack {
  constructor(scope: RGApp, id: string, props: RGStackProps) {
    super(scope, id, props);
    
    // Mix compliant constructs from this library...
    const logs = new RGLogGroup(this, 'Logs', { /* ... */ });
    
    // ...with native CDK constructs (RGApp will validate these too)
    const bucket = new Bucket(this, 'Bucket', { /* ... */ });
    const lambda = new Function(this, 'Lambda', { /* ... */ });
  }
}
```

**RGApp will validate all of these constructs**, flagging any compliance issues before deployment. You can then prioritize which constructs to migrate based on your compliance requirements and timeline.

### Adoption Paths

**Path 1: Visibility First**
1. Replace `App` with `RGApp` 
2. Review compliance report
3. Make fixes where needed

**Path 2: New Projects**
- Start with `RGApp` and `RGStack`
- Use compliant constructs from this library from day one
- Build secure infrastructure from the ground up

**Path 3: Gradual Migration**
1. Add `RGApp` for visibility
2. Migrate high-risk resources first (databases, APIs, storage)
3. Replace remaining constructs over time
4. Maintain mixed environment during transition

The key message: **This is not an all-or-nothing approach.** Every construct you adopt improves your security posture, and `RGApp` ensures you always know where you stand.

## Installation

### Prerequisites

- Node.js 16.x or later
- AWS CDK 2.221.1 or later
- An AWS account with appropriate permissions

### Install via npm

```bash
npm install @release-gateway/aws-cdk-constructs
```

### Install via Yarn

```bash
yarn add @release-gateway/aws-cdk-constructs
```

### Python Support

```bash
pip install release-gateway.aws-cdk-constructs
```

## Quick Start

### Option 1: Add Compliance Validation to an Existing App

The simplest way to get started is to add compliance validation to your existing CDK app:

```typescript
// Replace this:
import { App } from 'aws-cdk-lib';
const app = new App();

// With this:
import { RGApp } from '@release-gateway/aws-cdk-constructs';
const app = new RGApp();

// That's it! RGApp now validates all your existing constructs for compliance
```

By default, `RGApp` validates against:
- CIS AWS Benchmark Level 2
- NIST 800-53 Rev5
- AWS Well-Architected Reliability Pillar
- AWS Well-Architected Security Pillar

You can customize the compliance frameworks:

```typescript
import { RGApp, ComplianceFramework } from '@release-gateway/aws-cdk-constructs';

// Use only specific frameworks
const app = new RGApp({
  compliance: [
    ComplianceFramework.HIPAA_SECURITY,
    ComplianceFramework.PCI_DSS_3_2_1
  ]
});
```

Or control whether validation failures block deployment:

```typescript
// Report violations but don't fail synthesis
const app = new RGApp({
  throwErrorOnComplianceFail: false
});
```

### Option 2: Build a New Compliant Stack

For new projects, use both `RGApp` and `RGStack` for complete compliance:

```typescript
import { RGApp, RGStack, RGStackProps } from '@release-gateway/aws-cdk-constructs';

class MyStack extends RGStack {
  constructor(scope: RGApp, id: string, props: RGStackProps) {
    super(scope, id, props);
    
    // Your infrastructure code here - all constructs will be validated for compliance
  }
}

// Initialize and synthesize your CDK app
const app = new RGApp();
new MyStack(app, 'my-stack', {
  serviceName: 'My Service Name',
  version: '1.0.0'
});
app.synth();
```

**Key Point:** `RGApp` automatically validates ALL constructs in your stack—whether they're from this library, native AWS CDK, or custom constructs you've created. This gives you complete visibility into your compliance posture.

## Available Constructs

All constructs extend their AWS CDK counterparts and add compliance configurations automatically.

| Construct         | Extends           | Key Compliance Features                                                                                                       |
|:------------------|:------------------|:------------------------------------------------------------------------------------------------------------------------------|
| **RGApp**         | App               | **Validates ALL child constructs for compliance**—including native CDK, custom, and third-party constructs. See configuration options above. |
| **RGStack**       | Stack             | Adds standard tags and creates shared KMS key for child resources                                                             |
| **RGGuardValidator** | CfnGuardValidator | Validates against CIS 1.4, NIST 800-53 Rev5, and AWS Well-Architected Reliability & Security best practices                   |
| **RGLogGroup**    | LogGroup          | Enforces KMS encryption, configures removal policy, sets 1-week retention                                                     |
| **RGNodejsFunction** | NodejsFunction  | Requires VPC, creates encrypted log groups, configures DLQ, sets removal policy                                               |
| **RGQueue**       | Queue             | Enables KMS encryption, configures removal policy and DLQ                                                                     |
| **RGTable**       | TableV2           | Enables KMS encryption, configures removal policy                                                                             |
| **RGHttpApi**     | HttpApi           | Configures encrypted access logging and throttling defaults                                                                   |
| **RGRestApi**     | RestApi           | Enables encrypted access and execution logging, throttling defaults, regional endpoint type                                   |

## Examples

Check out the [examples directory](./examples) for complete, working examples:

- **[Kitchen Sink](./examples/kitchen-sink)** - Demonstrates all available constructs in a single stack

## Documentation

For detailed documentation on each construct, including all available properties and methods, please refer to:

- [API Documentation](https://github.com/Release-Gateway/aws-cdk-constructs) (Coming soon)
- [Examples](./examples)
- [Source Code](./src)

## Contributing

We welcome contributions! Whether it's bug reports, feature requests, or code contributions, your input helps make this library better for everyone.

### How to Contribute

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** and add tests as appropriate
3. **Ensure tests pass** by running `npm test`
4. **Lint your code** with `npm run lint`
5. **Submit a pull request** with a clear description of your changes

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

### Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/Release-Gateway/aws-cdk-constructs/issues) with:
- A clear, descriptive title
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment details (Node version, CDK version, etc.)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Release-Gateway/aws-cdk-constructs.git
cd aws-cdk-constructs

# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build

# Lint code
npm run lint
```

## Support

- **Issues**: [GitHub Issues](https://github.com/Release-Gateway/aws-cdk-constructs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Release-Gateway/aws-cdk-constructs/discussions)
- **Security**: See our [Security Policy](./SECURITY.md) for reporting vulnerabilities

## Roadmap

We're continuously improving this library. Planned enhancements include:

- Additional compliant constructs (RDS, ECS, EKS, etc.)
- Support for more compliance frameworks (HIPAA, SOC2, etc.)
- Comprehensive API documentation website
- Additional language bindings (Java, C#, Go)

Have ideas? [Open an issue](https://github.com/Release-Gateway/aws-cdk-constructs/issues) to share your suggestions!

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Attribution

Logo Icons
- Rocket by Gregor Cresnar from [Noun Project](https://thenounproject.com/browse/icons/term/rocket/) (CC BY 3.0)
- Checklist by Kartika Sholehatin from [Noun Project](https://thenounproject.com/browse/icons/term/checklist/) (CC BY 3.0)
- Code by Adiyogi from [Noun Project](https://thenounproject.com/browse/icons/term/code/) (CC BY 3.0)
