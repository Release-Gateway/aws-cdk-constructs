import * as packageJson from "../../package.json";

/**
 * Get a property from the package.json file
 * @param key The key to get
 */
export function getPackageProperty(key: keyof typeof packageJson): string {
    // @todo: Fix this return type to be dynamic based on input key type
    return packageJson[key] as string;
}
