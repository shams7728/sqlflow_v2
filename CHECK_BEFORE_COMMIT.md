# Check Before Committing to GitHub

## 🔍 Quick Security Check

Run these commands to verify no sensitive files will be uploaded:

### 1. Check for .env files

```bash
# This should return nothing (or show they're untracked)
git status | grep .env
```

### 2. Check for node_modules

```bash
# This should return nothing
git status | grep node_modules
```

### 3. Check for database files

```bash
# This should return nothing
git status | grep .db
```

### 4. See what WILL be committed

```bash
# Shows all files that will be uploaded
git status

# Or see a detailed list
git ls-files
```

### 5. Check file sizes

```bash
# Find large files (>10MB)
find . -type f -size +10M -not -path "*/node_modules/*"
```

## ✅ What SHOULD be committed:

### Source Code:

- ✅ `frontend/src/**/*.js`
- ✅ `frontend/src/**/*.jsx`
- ✅ `frontend/src/**/*.ts`
- ✅ `frontend/src/**/*.tsx`
- ✅ `frontend/src/**/*.css`
- ✅ `backend/**/*.js`
- ✅ `backend/routes/**/*.js`
- ✅ `backend/models/**/*.js`

### Configuration:

- ✅ `package.json` (both frontend and backend)
- ✅ `render.yaml`
- ✅ `frontend/vercel.json`
- ✅ `.gitignore`
- ✅ `README.md`

### Assets:

- ✅ `frontend/public/**/*` (images, icons, etc.)
- ✅ `frontend/src/assets/**/*`

### Documentation:

- ✅ All `.md` files
- ✅ Deployment guides

## ❌ What should NOT be committed:

### Sensitive Files:

- ❌ `.env` files (any environment variables)
- ❌ `backend/.env`
- ❌ `frontend/.env`
- ❌ Any file with passwords or API keys

### Dependencies:

- ❌ `node_modules/` folders
- ❌ `package-lock.json` (optional, but can cause conflicts)

### Build Outputs:

- ❌ `frontend/build/`
- ❌ `backend/dist/`

### Database Files:

- ❌ `*.db` files
- ❌ `*.sqlite` files

### IDE Files:

- ❌ `.vscode/`
- ❌ `.idea/`

### OS Files:

- ❌ `.DS_Store`
- ❌ `Thumbs.db`

## 🛡️ Security Verification

### Check for exposed secrets:

```bash
# Search for potential secrets in files to be committed
git diff --cached | grep -i "password"
git diff --cached | grep -i "secret"
git diff --cached | grep -i "api_key"
git diff --cached | grep -i "mongodb"
```

### If you find secrets:

```bash
# Remove file from staging
git reset HEAD path/to/file

# Edit the file to remove secrets
# Then add it back
git add path/to/file
```

## 🧹 Clean Up Before Commit

### Remove accidentally tracked files:

```bash
# If .env was accidentally added
git rm --cached backend/.env
git rm --cached frontend/.env

# If node_modules was accidentally added
git rm -r --cached node_modules
git rm -r --cached frontend/node_modules
git rm -r --cached backend/node_modules

# If database files were added
git rm --cached backend/lesson-data/*.db
```

### Verify .gitignore is working:

```bash
# Test if .env is ignored
touch test.env
git status | grep test.env
# Should show nothing or "Untracked files"
rm test.env
```

## 📊 Repository Size Check

```bash
# Check total size of files to be committed
du -sh .

# Should be under 100MB for free GitHub
# If larger, check for large files:
find . -type f -size +10M -not -path "*/node_modules/*" -not -path "*/.git/*"
```

## ✅ Final Checklist

Before running `git push`:

- [ ] No `.env` files in `git status`
- [ ] No `node_modules/` in `git status`
- [ ] No `.db` files in `git status`
- [ ] No sensitive data in code
- [ ] `.gitignore` is properly configured
- [ ] Repository size is reasonable (<100MB)
- [ ] All secrets are in environment variables
- [ ] Code builds successfully locally

## 🚀 Safe to Commit!

If all checks pass, you're ready to commit:

```bash
git add .
git commit -m "Initial commit: SQL-Flow platform"
git push origin main
```

## 🆘 Emergency: Already Committed Secrets?

If you accidentally committed sensitive data:

### Option 1: Remove from last commit (if not pushed yet)

```bash
# Remove file from last commit
git reset HEAD~1
# Edit .gitignore to include the file
echo "sensitive-file.env" >> .gitignore
# Commit again
git add .
git commit -m "Initial commit: SQL-Flow platform"
```

### Option 2: Remove from history (if already pushed)

```bash
# Remove file from all history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

### Option 3: Start fresh (easiest)

```bash
# Delete the repository on GitHub
# Delete local .git folder
rm -rf .git
# Start over with proper .gitignore
git init
git add .
git commit -m "Initial commit: SQL-Flow platform"
```

**Important**: If secrets were exposed, change them immediately!

- Generate new JWT secret
- Rotate API keys
- Update MongoDB password
- Update all environment variables

---

## 📝 Quick Reference

```bash
# Before committing
git status                    # Check what will be committed
git diff                      # See changes
git ls-files                  # List tracked files

# Clean up
git rm --cached file          # Untrack file
git reset HEAD file           # Unstage file

# Verify
git status | grep .env        # Should be empty
git status | grep node_modules # Should be empty
```

**Stay safe! 🔒**
