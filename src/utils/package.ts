import { readFileSync } from "fs";
import { join } from "path";

/**
 * Get a property from the package.json file
 * @param key The key to get
 */
let packageJson: Record<string, unknown>;
export function getPackageProperty(key: string): string | undefined {
    if (!packageJson) {
        packageJson = JSON.parse(readFileSync(join(__dirname, "../../package.json"), "utf8"));
    }
    // @todo: Fix this return type to be dynamic based on input key type
    return packageJson[key] as string;
}
