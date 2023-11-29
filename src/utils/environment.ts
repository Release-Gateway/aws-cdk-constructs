import { getPackageProperty } from "./package";

/**
 * Get environment variable
 *
 * @param name The name of the environment variable
 * @param throwIfNotSet Throw an error if the environment variable is not set
 */
export function getEnv(name: string, throwIfNotSet: boolean = true): string {
    const env = process.env[name];
    if (throwIfNotSet && !env) {
        throw new Error(`Environment variable ${name} not set`);
    }
    return env as string;
}

/**
 * Get the current environment
 */
export function getVersion(): string {
    const version = getPackageProperty("version");

    if (!version) {
        throw new Error("Unable to determine package version");
    }

    return version;
}
