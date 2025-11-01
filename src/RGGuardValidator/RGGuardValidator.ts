import { CfnGuardValidator } from "@cdklabs/cdk-validator-cfnguard";
import { CfnGuardValidatorProps } from "@cdklabs/cdk-validator-cfnguard/lib/plugin";
import {
    IPolicyValidationPluginBeta1,
    IPolicyValidationContextBeta1,
    PolicyValidationPluginReportBeta1,
} from "aws-cdk-lib";
import { join } from "path";

/**
 * Compliance frameworks supported by RGGuardValidator
 */
export enum ComplianceFramework {
    GUARD_RULES_REGISTRY_ALL_RULES = "guard-rules-registry-all-rules.guard",
    ABS_CCIGV2_MATERIAL = "ABS-CCIGv2-Material.guard",
    ABS_CCIGV2_STANDARD = "ABS-CCIGv2-Standard.guard",
    ACSC_ESSENTIAL_8 = "acsc-essential-8.guard",
    ACSC_ISM = "acsc-ism.guard",
    APRA_CPG_234 = "apra-cpg-234.guard",
    BNM_RMIT = "bnm-rmit.guard",
    CIS_AWS_BENCHMARK_LEVEL_1 = "cis-aws-benchmark-level-1.guard",
    CIS_AWS_BENCHMARK_LEVEL_2 = "cis-aws-benchmark-level-2.guard",
    CIS_CRITICAL_SECURITY_CONTROLS_V8_IG1 = "cis-critical-security-controls-v8-ig1.guard",
    CIS_CRITICAL_SECURITY_CONTROLS_V8_IG2 = "cis-critical-security-controls-v8-ig2.guard",
    CIS_CRITICAL_SECURITY_CONTROLS_V8_IG3 = "cis-critical-security-controls-v8-ig3.guard",
    CIS_TOP_20 = "cis-top-20.guard",
    CISA_CE = "cisa-ce.guard",
    CMMC_LEVEL_1 = "cmmc-level-1.guard",
    CMMC_LEVEL_2 = "cmmc-level-2.guard",
    CMMC_LEVEL_3 = "cmmc-level-3.guard",
    CMMC_LEVEL_4 = "cmmc-level-4.guard",
    CMMC_LEVEL_5 = "cmmc-level-5.guard",
    ENISA_CYBERSECURITY_GUIDE_FOR_SMES = "enisa-cybersecurity-guide-for-smes.guard",
    ENS_HIGH = "ens-high.guard",
    ENS_LOW = "ens-low.guard",
    ENS_MEDIUM = "ens-medium.guard",
    FDA_21CFR_PART_11 = "FDA-21CFR-Part-11.guard",
    FEDRAMP_LOW = "FedRAMP-Low.guard",
    FEDRAMP_MODERATE = "FedRAMP-Moderate.guard",
    FFIEC = "ffiec.guard",
    HIPAA_SECURITY = "hipaa-security.guard",
    K_ISMS = "K-ISMS.guard",
    MAS_NOTICE_655 = "mas-notice-655.guard",
    MAS_TRMG = "mas-trmg.guard",
    NBC_TRMG = "nbc-trmg.guard",
    NCSC_CAFV3 = "ncsc-cafv3.guard",
    NCSC = "ncsc.guard",
    NERC = "nerc.guard",
    NIST_800_171 = "nist-800-171.guard",
    NIST_800_172 = "nist-800-172.guard",
    NIST_800_181 = "nist-800-181.guard",
    NIST_1800_25 = "nist-1800-25.guard",
    NIST_CSF = "nist-csf.guard",
    NIST_PRIVACY_FRAMEWORK = "nist-privacy-framework.guard",
    NIST800_53_REV4 = "NIST800-53Rev4.guard",
    NIST800_53_REV5 = "NIST800-53Rev5.guard",
    NZISM = "nzism.guard",
    PCI_DSS_3_2_1 = "PCI-DSS-3-2-1.guard",
    RBI_BCSF_UCB = "rbi-bcsf-ucb.guard",
    RBI_MD_ITF = "rbi-md-itf.guard",
    US_NYDFS = "us-nydfs.guard",
    WA_RELIABILITY_PILLAR = "wa-Reliability-Pillar.guard",
    WA_SECURITY_PILLAR = "wa-Security-Pillar.guard",
}

export const RULES: Record<string, string> = {
    "guard-rules-registry-all-rules.guard": join(
        __dirname,
        "rules/guard-rules-registry-all-rules.guard"
    ),
    "ABS-CCIGv2-Material.guard": join(__dirname, "rules/ABS-CCIGv2-Material.guard"),
    "ABS-CCIGv2-Standard.guard": join(__dirname, "rules/ABS-CCIGv2-Standard.guard"),
    "acsc-essential-8.guard": join(__dirname, "rules/acsc-essential-8.guard"),
    "acsc-ism.guard": join(__dirname, "rules/acsc-ism.guard"),
    "apra-cpg-234.guard": join(__dirname, "rules/apra-cpg-234.guard"),
    "bnm-rmit.guard": join(__dirname, "rules/bnm-rmit.guard"),
    "cis-aws-benchmark-level-1.guard": join(__dirname, "rules/cis-aws-benchmark-level-1.guard"),
    "cis-aws-benchmark-level-2.guard": join(__dirname, "rules/cis-aws-benchmark-level-2.guard"),
    "cis-critical-security-controls-v8-ig1.guard": join(
        __dirname,
        "rules/cis-critical-security-controls-v8-ig1.guard"
    ),
    "cis-critical-security-controls-v8-ig2.guard": join(
        __dirname,
        "rules/cis-critical-security-controls-v8-ig2.guard"
    ),
    "cis-critical-security-controls-v8-ig3.guard": join(
        __dirname,
        "rules/cis-critical-security-controls-v8-ig3.guard"
    ),
    "cis-top-20.guard": join(__dirname, "rules/cis-top-20.guard"),
    "cisa-ce.guard": join(__dirname, "rules/cisa-ce.guard"),
    "cmmc-level-1.guard": join(__dirname, "rules/cmmc-level-1.guard"),
    "cmmc-level-2.guard": join(__dirname, "rules/cmmc-level-2.guard"),
    "cmmc-level-3.guard": join(__dirname, "rules/cmmc-level-3.guard"),
    "cmmc-level-4.guard": join(__dirname, "rules/cmmc-level-4.guard"),
    "cmmc-level-5.guard": join(__dirname, "rules/cmmc-level-5.guard"),
    "enisa-cybersecurity-guide-for-smes.guard": join(
        __dirname,
        "rules/enisa-cybersecurity-guide-for-smes.guard"
    ),
    "ens-high.guard": join(__dirname, "rules/ens-high.guard"),
    "ens-low.guard": join(__dirname, "rules/ens-low.guard"),
    "ens-medium.guard": join(__dirname, "rules/ens-medium.guard"),
    "FDA-21CFR-Part-11.guard": join(__dirname, "rules/FDA-21CFR-Part-11.guard"),
    "FedRAMP-Low.guard": join(__dirname, "rules/FedRAMP-Low.guard"),
    "FedRAMP-Moderate.guard": join(__dirname, "rules/FedRAMP-Moderate.guard"),
    "ffiec.guard": join(__dirname, "rules/ffiec.guard"),
    "hipaa-security.guard": join(__dirname, "rules/hipaa-security.guard"),
    "K-ISMS.guard": join(__dirname, "rules/K-ISMS.guard"),
    "mas-notice-655.guard": join(__dirname, "rules/mas-notice-655.guard"),
    "mas-trmg.guard": join(__dirname, "rules/mas-trmg.guard"),
    "nbc-trmg.guard": join(__dirname, "rules/nbc-trmg.guard"),
    "ncsc-cafv3.guard": join(__dirname, "rules/ncsc-cafv3.guard"),
    "ncsc.guard": join(__dirname, "rules/ncsc.guard"),
    "nerc.guard": join(__dirname, "rules/nerc.guard"),
    "nist-800-171.guard": join(__dirname, "rules/nist-800-171.guard"),
    "nist-800-172.guard": join(__dirname, "rules/nist-800-172.guard"),
    "nist-800-181.guard": join(__dirname, "rules/nist-800-181.guard"),
    "nist-1800-25.guard": join(__dirname, "rules/nist-1800-25.guard"),
    "nist-csf.guard": join(__dirname, "rules/nist-csf.guard"),
    "nist-privacy-framework.guard": join(__dirname, "rules/nist-privacy-framework.guard"),
    "NIST800-53Rev4.guard": join(__dirname, "rules/NIST800-53Rev4.guard"),
    "NIST800-53Rev5.guard": join(__dirname, "rules/NIST800-53Rev5.guard"),
    "nzism.guard": join(__dirname, "rules/nzism.guard"),
    "PCI-DSS-3-2-1.guard": join(__dirname, "rules/PCI-DSS-3-2-1.guard"),
    "rbi-bcsf-ucb.guard": join(__dirname, "rules/rbi-bcsf-ucb.guard"),
    "rbi-md-itf.guard": join(__dirname, "rules/rbi-md-itf.guard"),
    "us-nydfs.guard": join(__dirname, "rules/us-nydfs.guard"),
    "wa-Reliability-Pillar.guard": join(__dirname, "rules/wa-Reliability-Pillar.guard"),
    "wa-Security-Pillar.guard": join(__dirname, "rules/wa-Security-Pillar.guard"),
};

export interface RGGuardValidatorProps extends CfnGuardValidatorProps {
    /**
     * Whether to throw an error when compliance validation fails.
     * If set to false, validation failures will be reported but will not fail the synthesis.
     *
     * @default true
     */
    readonly throwErrorOnComplianceFail?: boolean;
}

const defaultProps: RGGuardValidatorProps = {
    rules: [
        RULES[ComplianceFramework.CIS_AWS_BENCHMARK_LEVEL_2],
        RULES[ComplianceFramework.NIST800_53_REV5],
        RULES[ComplianceFramework.WA_RELIABILITY_PILLAR],
        RULES[ComplianceFramework.WA_SECURITY_PILLAR],
    ],
    // Control tower can conflict with the above rules but also dont support exemptions
    controlTowerRulesEnabled: false,
    throwErrorOnComplianceFail: true,
};

/**
 * A validator that uses the AWS CloudFormation Guard CLI to validate a stack.
 * Supports configurable compliance frameworks and error handling.
 */
export class RGGuardValidator implements IPolicyValidationPluginBeta1 {
    public rules: string[];
    public readonly name: string;
    public readonly version?: string;
    public readonly ruleIds?: string[];
    private readonly throwErrorOnComplianceFail: boolean;
    private readonly validator: CfnGuardValidator;

    constructor(props: RGGuardValidatorProps = defaultProps) {
        if (!props.rules || props.rules.length === 0) {
            throw new Error("You must provide at least one rule to the RGGuardValidator");
        }

        this.rules = props.rules;
        this.throwErrorOnComplianceFail = props.throwErrorOnComplianceFail ?? true;
        this.validator = new CfnGuardValidator(props);
        this.name = this.validator.name;
        this.version = this.validator.version;
        this.ruleIds = this.validator.ruleIds;
    }

    validate(context: IPolicyValidationContextBeta1): PolicyValidationPluginReportBeta1 {
        const report = this.validator.validate(context);

        // If throwErrorOnComplianceFail is false, override success to true
        // to prevent synthesis failure while still reporting violations
        if (!this.throwErrorOnComplianceFail && !report.success) {
            return {
                ...report,
                success: true,
                metadata: {
                    ...report.metadata,
                    // Note: metadata values must be strings per
                    // PolicyValidationPluginReportBeta1 interface
                    suppressedFailure: "true",
                },
            };
        }

        return report;
    }
}
