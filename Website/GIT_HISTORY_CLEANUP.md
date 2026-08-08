# Instructions to Remove server/.env from Git History

**Warning:** These operations rewrite git history. Make sure to backup your repository before proceeding.

## Option 1: Using git filter-repo (Recommended - faster and more powerful)

1. Install git filter-repo:
   ```bash
   # For macOS with Homebrew
   brew install git-filter-repo
   
   # For Ubuntu/Debian
   sudo apt-get install git-filter-repo
   
   # For Windows (via Chocolatey)
   choco install git-filter-repo
   ```

2. Run the filter to remove server/.env from all commits:
   ```bash
   git filter-repo --path server/.env --invert-paths
   ```

3. Force push to update the remote repository:
   ```bash
   git push origin --force --all
   git push origin --force --tags
   ```

## Option 2: Using BFG Repo-Cleaner (Alternative)

1. Install BFG (requires Java):
   ```bash
   # Download from https://rtyley.github.io/bfg-repo-cleaner/
   # Or install via package manager
   brew install bfg  # macOS
   ```

2. Clone a mirror of your repository (required for BFG):
   ```bash
   git clone --mirror https://github.com/your-username/your-repo.git
   cd your-repo.git
   ```

3. Run BFG to remove server/.env:
   ```bash
   bfg --delete-files server/.env
   ```

4. Clean up and push:
   ```bash
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   git push
   ```

## Option 3: Using git filter-branch (Built-in but slower)

```bash
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch server/.env' \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
git push origin --force --tags
```

## After Cleanup

1. Add server/.env to .gitignore (already done):
   ```
   # Environment variables
   .env
   server/.env
   ```

2. Create a new .env file if needed:
   ```bash
   cp server/.env.example server/.env
   # Then edit server/.env with your actual environment variables
   ```

3. Notify all collaborators to re-clone the repository, as their local clones will have issues with pushes/pulls after history rewrite.

## Verification

To verify server/.env is removed from history:
```bash
git log --all --full-history -- server/.env
```
This should return no commits.