### Feature Request: Customizable Compliance Enforcement in RGApp

#### Objective
Enable users to choose the compliance framework(s) enforced by RGApp during CDK synthesis.

#### Proposed Implementation
Introduce two new constructor properties for RGApp:
1. **`compliance`**: An optional array of ENUM values representing the compliance frameworks available (e.g., CIS, NIST). By default, this should enforce all available compliance frameworks.
2. **`throwErrorOnComplianceFail`**: An optional Boolean indicating whether compliance failures should throw an error during CDK synthesis. Default value: `true`.

#### Default Behavior
- Maintain current default behavior (enforce all compliance frameworks and throw errors on failures).

#### Tasks
1. Define ENUM values for available compliance frameworks.
2. Update RGApp constructor to accept `compliance` and `throwErrorOnComplianceFail` properties.
3. Implement logic to enforce selected compliance frameworks.
4. Add unit tests to validate new functionality.
5. Update documentation to reflect new configuration options.

#### Impact
- Improved flexibility for users to customize compliance enforcement.

#### Example Usage
```typescript
const app = new RGApp({
  compliance: [ComplianceFramework.CIS, ComplianceFramework.NIST],
  throwErrorOnComplianceFail: false,
});
```

---

Please comment with any feedback or suggestions!