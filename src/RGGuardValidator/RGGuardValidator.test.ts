import { RGGuardValidator, RULES } from "./";

describe("GuardValidator", () => {
    describe("Default behaviour", () => {
        let guard: RGGuardValidator;
        beforeAll(() => {
            guard = new RGGuardValidator();
        });

        it("should have CIS, NIST, WA Reliability and Security rules configured", () => {
            expect(guard.rules).toEqual(
                expect.arrayContaining([
                    expect.stringContaining("cis-aws-benchmark-level-2.guard"),
                    expect.stringContaining("NIST800-53Rev5.guard"),
                    expect.stringContaining("wa-Reliability-Pillar.guard"),
                    expect.stringContaining("wa-Security-Pillar.guard"),
                ])
            );
            expect(guard.rules.length).toEqual(4);
        });
    });

    it("should instantiate without error", () => {
        expect(() => {
            new RGGuardValidator();
        }).not.toThrow();
    });

    it("should throw if no rules are configured", () => {
        expect(() => {
            new RGGuardValidator({ rules: [] });
        }).toThrow("You must provide at least one rule to the RGGuardValidator");
    });

    it("should export the full list of supported rules", () => {
        expect(RULES).toMatchObject({
            "ABS-CCIGv2-Material.guard": expect.stringContaining("rules/ABS-CCIGv2-Material.guard"),
            "ABS-CCIGv2-Standard.guard": expect.stringContaining("rules/ABS-CCIGv2-Standard.guard"),
            "FDA-21CFR-Part-11.guard": expect.stringContaining("rules/FDA-21CFR-Part-11.guard"),
            "FedRAMP-Low.guard": expect.stringContaining("rules/FedRAMP-Low.guard"),
            "FedRAMP-Moderate.guard": expect.stringContaining("rules/FedRAMP-Moderate.guard"),
            "K-ISMS.guard": expect.stringContaining("rules/K-ISMS.guard"),
            "NIST800-53Rev4.guard": expect.stringContaining("rules/NIST800-53Rev4.guard"),
            "NIST800-53Rev5.guard": expect.stringContaining("rules/NIST800-53Rev5.guard"),
            "PCI-DSS-3-2-1.guard": expect.stringContaining("rules/PCI-DSS-3-2-1.guard"),
            "acsc-essential-8.guard": expect.stringContaining("rules/acsc-essential-8.guard"),
            "acsc-ism.guard": expect.stringContaining("rules/acsc-ism.guard"),
            "apra-cpg-234.guard": expect.stringContaining("rules/apra-cpg-234.guard"),
            "bnm-rmit.guard": expect.stringContaining("rules/bnm-rmit.guard"),
            "cis-aws-benchmark-level-1.guard": expect.stringContaining(
                "rules/cis-aws-benchmark-level-1.guard"
            ),
            "cis-aws-benchmark-level-2.guard": expect.stringContaining(
                "rules/cis-aws-benchmark-level-2.guard"
            ),
            "cis-critical-security-controls-v8-ig1.guard": expect.stringContaining(
                "rules/cis-critical-security-controls-v8-ig1.guard"
            ),
            "cis-critical-security-controls-v8-ig2.guard": expect.stringContaining(
                "rules/cis-critical-security-controls-v8-ig2.guard"
            ),
            "cis-critical-security-controls-v8-ig3.guard": expect.stringContaining(
                "rules/cis-critical-security-controls-v8-ig3.guard"
            ),
            "cis-top-20.guard": expect.stringContaining("rules/cis-top-20.guard"),
            "cisa-ce.guard": expect.stringContaining("rules/cisa-ce.guard"),
            "cmmc-level-1.guard": expect.stringContaining("rules/cmmc-level-1.guard"),
            "cmmc-level-2.guard": expect.stringContaining("rules/cmmc-level-2.guard"),
            "cmmc-level-3.guard": expect.stringContaining("rules/cmmc-level-3.guard"),
            "cmmc-level-4.guard": expect.stringContaining("rules/cmmc-level-4.guard"),
            "cmmc-level-5.guard": expect.stringContaining("rules/cmmc-level-5.guard"),
            "enisa-cybersecurity-guide-for-smes.guard": expect.stringContaining(
                "rules/enisa-cybersecurity-guide-for-smes.guard"
            ),
            "ens-high.guard": expect.stringContaining("rules/ens-high.guard"),
            "ens-low.guard": expect.stringContaining("rules/ens-low.guard"),
            "ens-medium.guard": expect.stringContaining("rules/ens-medium.guard"),
            "ffiec.guard": expect.stringContaining("rules/ffiec.guard"),
            "guard-rules-registry-all-rules.guard": expect.stringContaining(
                "rules/guard-rules-registry-all-rules.guard"
            ),
            "hipaa-security.guard": expect.stringContaining("rules/hipaa-security.guard"),
            "mas-notice-655.guard": expect.stringContaining("rules/mas-notice-655.guard"),
            "mas-trmg.guard": expect.stringContaining("rules/mas-trmg.guard"),
            "nbc-trmg.guard": expect.stringContaining("rules/nbc-trmg.guard"),
            "ncsc-cafv3.guard": expect.stringContaining("rules/ncsc-cafv3.guard"),
            "ncsc.guard": expect.stringContaining("rules/ncsc.guard"),
            "nerc.guard": expect.stringContaining("rules/nerc.guard"),
            "nist-1800-25.guard": expect.stringContaining("rules/nist-1800-25.guard"),
            "nist-800-171.guard": expect.stringContaining("rules/nist-800-171.guard"),
            "nist-800-172.guard": expect.stringContaining("rules/nist-800-172.guard"),
            "nist-800-181.guard": expect.stringContaining("rules/nist-800-181.guard"),
            "nist-csf.guard": expect.stringContaining("rules/nist-csf.guard"),
            "nist-privacy-framework.guard": expect.stringContaining(
                "rules/nist-privacy-framework.guard"
            ),
            "nzism.guard": expect.stringContaining("rules/nzism.guard"),
            "rbi-bcsf-ucb.guard": expect.stringContaining("rules/rbi-bcsf-ucb.guard"),
            "rbi-md-itf.guard": expect.stringContaining("rules/rbi-md-itf.guard"),
            "us-nydfs.guard": expect.stringContaining("rules/us-nydfs.guard"),
            "wa-Reliability-Pillar.guard": expect.stringContaining(
                "rules/wa-Reliability-Pillar.guard"
            ),
            "wa-Security-Pillar.guard": expect.stringContaining("rules/wa-Security-Pillar.guard"),
        });
    });
});
