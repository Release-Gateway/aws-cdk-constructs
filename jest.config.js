module.exports = {
    testEnvironment: "node",
    roots: ["<rootDir>/test"],
    testMatch: ["**/*.test.ts"],
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
