import { App, AppProps } from "aws-cdk-lib";
import { RGGuardValidator, RULES, ComplianceFramework } from "../RGGuardValidator/RGGuardValidator";

export interface RGAppProps extends AppProps {
    /**
     * Compliance frameworks to enforce during CDK synthesis.
     * If not specified, defaults to CIS AWS Benchmark Level 2,
     * NIST 800-53 Rev5, Well-Architected Reliability Pillar,
     * and Well-Architected Security Pillar.
     *
     * @default [ComplianceFramework.CIS_AWS_BENCHMARK_LEVEL_2,
     * ComplianceFramework.NIST800_53_REV5,
     * ComplianceFramework.WA_RELIABILITY_PILLAR,
     * ComplianceFramework.WA_SECURITY_PILLAR]
     */
    readonly compliance?: ComplianceFramework[];

    /**
     * Whether to throw an error when compliance validation fails.
     * If set to false, validation failures will be reported
     * but will not fail the synthesis.
     *
     * @default true
     */
    readonly throwErrorOnComplianceFail?: boolean;
}

export class RGApp extends App {
    // public sharedResourcesStack: SharedResourceStack;

    constructor(props?: RGAppProps) {
        const { compliance, throwErrorOnComplianceFail, ...appProps } = props || {};

        // Map compliance frameworks to rule paths
        const rules = compliance
            ? compliance.map((framework) => RULES[framework])
            : [
                  RULES[ComplianceFramework.CIS_AWS_BENCHMARK_LEVEL_2],
                  RULES[ComplianceFramework.NIST800_53_REV5],
                  RULES[ComplianceFramework.WA_RELIABILITY_PILLAR],
                  RULES[ComplianceFramework.WA_SECURITY_PILLAR],
              ];

        super({
            policyValidationBeta1: [
                new RGGuardValidator({
                    rules,
                    controlTowerRulesEnabled: false,
                    throwErrorOnComplianceFail: throwErrorOnComplianceFail ?? true,
                }),
            ],
            ...appProps,
        });
    }
}
