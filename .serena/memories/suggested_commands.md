# Suggested Commands

## Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

## Package Management
```bash
# Install dependencies
npm install

# Add a new package
npm install <package-name>

# Remove a package
npm uninstall <package-name>
```

## Git Commands
```bash
# Check status
git status

# Add files
git add .

# Commit (remember to use conventional commit format)
git commit -m "feat: description"
git commit -m "fix: description"
git commit -m "chore: description"
git commit -m "docs: description"

# Push changes
git push

# Pull changes
git pull
```

## System Commands (macOS)
```bash
# List files
ls -la

# Find files
find . -name "*.tsx"

# Search in files
grep -r "search term" src/

# Change directory
cd path/to/directory
```

## Development URLs
- Local development: http://localhost:3000
- Production build test: http://localhost:3000 (after npm run build && npm start)