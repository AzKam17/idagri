# Task Completion Checklist

When a coding task is completed, perform the following steps:

## 1. Type Checking
```bash
npx tsc --noEmit
```
Ensure no TypeScript errors are present.

## 2. Code Linting
```bash
npm run lint
```
Fix any linting errors or warnings.

## 3. Build Verification
```bash
npm run build
```
Ensure the project builds successfully without errors.

## 4. Testing
- Manual testing in development mode
- Test all affected features
- Test edge cases
- Verify LocalStorage persistence

## 5. Code Review
- Check for adherence to code style guidelines
- Ensure proper TypeScript typing
- Verify accessibility standards
- Check for proper error handling
- Ensure design system compliance (rounded corners, shadows, no borders, etc.)

## 6. Git Commit (if requested)
- Use conventional commit format: "feat:", "fix:", "chore:", "docs:"
- Keep commit messages concise (one line)
- Do NOT mention Claude in commits
- Example: `git commit -m "feat: add transporter management module"`

## 7. Documentation
- Update relevant comments if needed
- Do NOT create markdown documentation files unless explicitly requested
- User has requested to stop writing md files after every task

## Notes
- Always ensure the app runs without errors before considering a task complete
- Test in the browser to verify visual and functional correctness
- Verify LocalStorage data persistence works correctly