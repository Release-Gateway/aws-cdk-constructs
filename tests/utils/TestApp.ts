import { RGApp } from "../../src/RGApp/RGApp";
import { readFileSync } from "fs";
import { join } from "path";
import { PolicyValidationReportJson } from "aws-cdk-lib/core/lib/validation/private/report";

/**
 * A test app that can be used to validate the stack against the cloud standards.
 */
export class TestApp extends RGApp {
    private policyValidationReportJson: PolicyValidationReportJson;

    constructor() {
        super({
            context: { "@aws-cdk/core:validationReportJson": true },
        });
    }

    /**
     * Returns the policy validation report for the stack after synthesizing
     */
    public getPolicyReport(): PolicyValidationReportJson {
        if (!this.policyValidationReportJson) {
            this.synth();
            this.policyValidationReportJson = JSON.parse(
                readFileSync(join(this.outdir, "policy-validation-report.json")).toString("utf-8")
            );

            if (this.policyValidationReportJson.pluginReports.length > 0) {
                console.log("Policy validation failures:");
                this.policyValidationReportJson.pluginReports.forEach((r) => console.log(r));
            }
        }

        return this.policyValidationReportJson;
    }

    /**
     * Returns true if the stack is compliant with the cloud standards.
     */
    public isCompliantWithCloudStandards() {
        return this.getPolicyReport().pluginReports.length === 0;
    }
}
