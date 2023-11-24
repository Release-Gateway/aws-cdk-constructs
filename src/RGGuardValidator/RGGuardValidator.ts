import { CfnGuardValidator } from "@cdklabs/cdk-validator-cfnguard";
import { CfnGuardValidatorProps } from "@cdklabs/cdk-validator-cfnguard/lib/plugin";
import { join } from "path";

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
    rules?: (keyof typeof RULES)[];
}

const defaultProps: RGGuardValidatorProps = {
    rules: [
        RULES["cis-aws-benchmark-level-2.guard"],
        RULES["NIST800-53Rev5.guard"],
        RULES["wa-Reliability-Pillar.guard"],
        RULES["wa-Security-Pillar.guard"],
    ],
    // Control tower can conflict with the above rules but also dont support exemptions
    controlTowerRulesEnabled: false,
};

/**
 * A validator that uses the AWS CloudFormation Guard CLI to validate a stack.
 */
export class RGGuardValidator extends CfnGuardValidator {
    constructor(props: RGGuardValidatorProps = defaultProps) {
        super(props);
    }
}
