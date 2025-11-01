# Mergify Automated PR Rebasing

This repository uses [Mergify](https://mergify.com/) to automate pull request management, specifically for rebasing PRs to keep them up-to-date with the base branch.

## Features

### 1. Automatic Rebasing
PRs are automatically rebased when they become outdated (commits behind the base branch), provided:
- The PR has no merge conflicts
- The PR is not a draft
- The PR is behind the base branch

### 2. Manual Rebase Triggers
You can manually trigger a rebase in two ways:

**Using a Label:**
- Add the `rebase` label to the PR
- Mergify will rebase the PR and automatically remove the label

**Using a Comment:**
- Comment on the PR with `@mergifyio rebase` or `@mergify rebase`
- Mergify will rebase the PR immediately

### 3. Bot PR Management

**Dependabot PRs:**
- Automatically rebased when outdated (via the general auto-rebase rule)
- Automatically merged when CI checks pass (can be disabled with `do-not-merge` label)
- Uses squash merge strategy

**AI Copilot PRs:**
- Automatically rebased when outdated (via the general auto-rebase rule)
- Receives a comment requesting human review
- Includes instructions on how to manually rebase if needed

### 4. Conflict Detection
- PRs with merge conflicts are automatically labeled with `conflict`
- A comment is posted explaining the issue
- Label is automatically removed when conflicts are resolved

### 5. Merge Queue
- Ensures PRs are merged sequentially using squash merge
- Verifies that `lint` and `test` CI checks pass before merging
- Prevents race conditions when multiple PRs are ready to merge

## Usage Examples

### Rebase a PR manually
Comment on the PR:
```
@mergifyio rebase
```

Or add the `rebase` label through the GitHub UI.

### Prevent automatic merge of Dependabot PR
Add the `do-not-merge` label to the PR.

### Check Mergify status
Mergify will post status updates as comments on PRs when actions are taken.

## Configuration

The Mergify configuration is located at `.mergify.yml` in the repository root.

### Key Rules

1. **automatic rebase when outdated** - Keeps all PRs current with base branch (including bot PRs)
2. **rebase on label** - Manual rebase trigger via label
3. **label conflicting PRs** - Identifies PRs that need conflict resolution
4. **auto-merge dependabot PRs** - Automatically merges passing dependency updates
5. **request review for AI bot PRs** - Ensures human oversight of AI-generated code

Note: The `@mergifyio rebase` command is a built-in Mergify feature and works without needing an explicit rule.

## Best Practices for Solo Development with AI Bots

1. **Keep PRs Small**: Smaller PRs rebase faster and have fewer conflicts
2. **Use Draft PRs**: Mark WIP PRs as drafts to prevent automatic rebasing
3. **Monitor Conflicts**: Address conflicts promptly when the `conflict` label appears
4. **Review Bot PRs**: Always review AI-generated PRs before merging, even if automated
5. **Use Labels**: Apply `do-not-merge` when you need time to review changes
6. **Leverage Auto-rebase**: Let Mergify keep your PRs current automatically

## Troubleshooting

### PR not rebasing automatically
- Check that the PR is not a draft
- Ensure there are no merge conflicts
- Verify the PR is actually behind the base branch

### Dependabot PR not auto-merging
- Ensure CI checks (`lint` and `test`) are passing
- Check that the `do-not-merge` label is not applied
- Verify the PR has no conflicts

### Need help?
Refer to the [Mergify documentation](https://docs.mergify.com/) for more details.
