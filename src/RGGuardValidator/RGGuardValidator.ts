import { CfnGuardValidator } from "@cdklabs/cdk-validator-cfnguard";
import { CfnGuardValidatorProps } from "@cdklabs/cdk-validator-cfnguard/lib/plugin";

export enum RULES {
    "guard-rules-registry-all-rules.guard" = "rules/guard-rules-registry-all-rules.guard",
    "ABS-CCIGv2-Material.guard" = "rules/ABS-CCIGv2-Material.guard",
    "ABS-CCIGv2-Standard.guard" = "rules/ABS-CCIGv2-Standard.guard",
    "acsc-essential-8.guard" = "rules/acsc-essential-8.guard",
    "acsc-ism.guard" = "rules/acsc-ism.guard",
    "apra-cpg-234.guard" = "rules/apra-cpg-234.guard",
    "bnm-rmit.guard" = "rules/bnm-rmit.guard",
    "cis-aws-benchmark-level-1.guard" = "rules/cis-aws-benchmark-level-1.guard",
    "cis-aws-benchmark-level-2.guard" = "rules/cis-aws-benchmark-level-2.guard",
    "cis-critical-security-controls-v8-ig1.guard" = "rules/cis-critical-security-controls-v8-ig1.guard",
    "cis-critical-security-controls-v8-ig2.guard" = "rules/cis-critical-security-controls-v8-ig2.guard",
    "cis-critical-security-controls-v8-ig3.guard" = "rules/cis-critical-security-controls-v8-ig3.guard",
    "cis-top-20.guard" = "rules/cis-top-20.guard",
    "cisa-ce.guard" = "rules/cisa-ce.guard",
    "cmmc-level-1.guard" = "rules/cmmc-level-1.guard",
    "cmmc-level-2.guard" = "rules/cmmc-level-2.guard",
    "cmmc-level-3.guard" = "rules/cmmc-level-3.guard",
    "cmmc-level-4.guard" = "rules/cmmc-level-4.guard",
    "cmmc-level-5.guard" = "rules/cmmc-level-5.guard",
    "enisa-cybersecurity-guide-for-smes.guard" = "rules/enisa-cybersecurity-guide-for-smes.guard",
    "ens-high.guard" = "rules/ens-high.guard",
    "ens-low.guard" = "rules/ens-low.guard",
    "ens-medium.guard" = "rules/ens-medium.guard",
    "FDA-21CFR-Part-11.guard" = "rules/FDA-21CFR-Part-11.guard",
    "FedRAMP-Low.guard" = "rules/FedRAMP-Low.guard",
    "FedRAMP-Moderate.guard" = "rules/FedRAMP-Moderate.guard",
    "ffiec.guard" = "rules/ffiec.guard",
    "hipaa-security.guard" = "rules/hipaa-security.guard",
    "K-ISMS.guard" = "rules/K-ISMS.guard",
    "mas-notice-655.guard" = "rules/mas-notice-655.guard",
    "mas-trmg.guard" = "rules/mas-trmg.guard",
    "nbc-trmg.guard" = "rules/nbc-trmg.guard",
    "ncsc-cafv3.guard" = "rules/ncsc-cafv3.guard",
    "ncsc.guard" = "rules/ncsc.guard",
    "nerc.guard" = "rules/nerc.guard",
    "nist-800-171.guard" = "rules/nist-800-171.guard",
    "nist-800-172.guard" = "rules/nist-800-172.guard",
    "nist-800-181.guard" = "rules/nist-800-181.guard",
    "nist-1800-25.guard" = "rules/nist-1800-25.guard",
    "nist-csf.guard" = "rules/nist-csf.guard",
    "nist-privacy-framework.guard" = "rules/nist-privacy-framework.guard",
    "NIST800-53Rev4.guard" = "rules/NIST800-53Rev4.guard",
    "NIST800-53Rev5.guard" = "rules/NIST800-53Rev5.guard",
    "nzism.guard" = "rules/nzism.guard",
    "PCI-DSS-3-2-1.guard" = "rules/PCI-DSS-3-2-1.guard",
    "rbi-bcsf-ucb.guard" = "rules/rbi-bcsf-ucb.guard",
    "rbi-md-itf.guard" = "rules/rbi-md-itf.guard",
    "us-nydfs.guard" = "rules/us-nydfs.guard",
    "wa-Reliability-Pillar.guard" = "rules/wa-Reliability-Pillar.guard",
    "wa-Security-Pillar.guard" = "rules/wa-Security-Pillar.guard",
}

export interface RGGuardValidatorProps extends CfnGuardValidatorProps {
    rules?: RULES[];
}

const defaultProps: RGGuardValidatorProps = {
    rules: [
        RULES["cis-aws-benchmark-level-2.guard"],
        RULES["NIST800-53Rev5.guard"],
        RULES["wa-Reliability-Pillar.guard"],
        RULES["wa-Security-Pillar.guard"],
    ],
};

/**
 * A validator that uses the AWS CloudFormation Guard CLI to validate a stack.
 */
export class RGGuardValidator extends CfnGuardValidator {
    constructor(props: RGGuardValidatorProps = defaultProps) {
        super(props);
    }
}
