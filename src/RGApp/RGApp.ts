import { App, AppProps } from "aws-cdk-lib";
import { RGGuardValidator } from "../RGGuardValidator/RGGuardValidator";
export class RGApp extends App {
    // public sharedResourcesStack: SharedResourceStack;

    constructor(props?: AppProps) {
        super({
            policyValidationBeta1: [new RGGuardValidator()],
            ...props,
        });
    }
}
