import { App } from "aws-cdk-lib";
import { RGGuardValidator } from "../RGGuardValidator/RGGuardValidator";

export class RGApp extends App {
    constructor() {
        super({
            policyValidationBeta1: [new RGGuardValidator()],
        });
    }
}
