module.exports = {
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/*.test.ts"],
    coveragePathIgnorePatterns: ["/src/testing/"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    collectCoverage: true,
    collectCoverageFrom: ["./src/**"],
    prettierPath: require.resolve("prettier-2"),
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 30,
            statements: -10,
        },
    },
};
