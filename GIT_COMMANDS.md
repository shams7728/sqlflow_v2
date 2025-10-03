# Git Commands for Deployment

## 🚀 Step-by-Step Git Commands

### Step 1: Check Current Status
```bash
# See what files will be committed
git status

# See what's in .gitignore
cat .gitignore
```

### Step 2: Initialize Git (if needed)
```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
```

### Step 3: Add All Files
```bash
# Add all files to staging
git add .

# Or add specific files
git add backend/
git add frontend/
git add *.md
git add render.yaml
```

### Step 4: Commit Changes
```bash
# Commit with a message
git commit -m "Initial commit: SQL-Flow learning platform with visual JOIN diagrams and progress tracking"
```

### Step 5: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `sqlflow`
3. Description: "AI-Powered SQL Learning Platform with Interactive Lessons"
4. Choose Public or Private
5. **Don't** check "Initialize with README"
6. Click "Create repository"

### Step 6: Add Remote and Push
```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sqlflow.git

# Verify remote was added
git remote -v

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 🔄 Future Updates

### After Making Changes
```bash
# Check what changed
git status

# See the actual changes
git diff

# Add changed files
git add .

# Commit with descriptive message
git commit -m "Add feature: Achievement notifications"

# Push to GitHub
git push origin main
```

---

## 🐛 Common Issues & Solutions

### Issue: "fatal: not a git repository"
```bash
# Solution: Initialize git
git init
```

### Issue: "remote origin already exists"
```bash
# Solution: Remove and re-add
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/sqlflow.git
```

### Issue: "failed to push some refs"
```bash
# Solution: Pull first, then push
git pull origin main --rebase
git push origin main
```

### Issue: "Permission denied (publickey)"
```bash
# Solution: Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/sqlflow.git

# Or set up SSH keys:
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Issue: Large files causing push to fail
```bash
# Check file sizes
find . -type f -size +50M

# If you have large files, add to .gitignore
echo "large-file.db" >> .gitignore
git rm --cached large-file.db
git commit -m "Remove large file"
git push origin main
```

---

## 📝 Git Best Practices

### Commit Messages
```bash
# Good commit messages:
git commit -m "Add JOIN visualizer component"
git commit -m "Fix progress tracking in sidebar"
git commit -m "Update deployment configuration"

# Bad commit messages:
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

### Before Committing
```bash
# Always check what you're committing
git status
git diff

# Make sure .env files are NOT included
git status | grep .env
# Should show nothing or "Untracked files"
```

### Branching (Optional)
```bash
# Create a new branch for features
git checkout -b feature/new-lesson-type

# Make changes, commit
git add .
git commit -m "Add new lesson type"

# Push branch
git push origin feature/new-lesson-type

# Merge to main (on GitHub via Pull Request)
```

---

## 🔐 Security Check Before Push

### Check for Sensitive Data
```bash
# Search for potential secrets in staged files
git diff --cached | grep -i "password"
git diff --cached | grep -i "secret"
git diff --cached | grep -i "api_key"

# If found, remove from staging
git reset HEAD path/to/file
```

### Verify .gitignore
```bash
# Make sure these are in .gitignore:
cat .gitignore | grep ".env"
cat .gitignore | grep "node_modules"

# If not, add them:
echo ".env" >> .gitignore
echo "*.env" >> .gitignore
echo "node_modules/" >> .gitignore
```

---

## 📊 Useful Git Commands

### View History
```bash
# See commit history
git log

# See compact history
git log --oneline

# See last 5 commits
git log -5
```

### Undo Changes
```bash
# Undo changes to a file (before commit)
git checkout -- filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### View Remote Info
```bash
# See remote repositories
git remote -v

# See remote branches
git branch -r

# See all branches
git branch -a
```

---

## ✅ Deployment Checklist

Before pushing to GitHub:
- [ ] All sensitive data in .gitignore
- [ ] No .env files committed
- [ ] Code builds successfully
- [ ] No console.errors
- [ ] README updated
- [ ] Deployment files created

After pushing to GitHub:
- [ ] Repository is visible on GitHub
- [ ] All files are there
- [ ] No sensitive data visible
- [ ] README displays correctly

---

## 🎯 Quick Reference

```bash
# Complete workflow
git status                    # Check status
git add .                     # Stage all files
git commit -m "message"       # Commit changes
git push origin main          # Push to GitHub

# First time setup
git init                      # Initialize
git remote add origin URL     # Add remote
git branch -M main            # Rename branch
git push -u origin main       # First push

# Daily workflow
git pull origin main          # Get latest
# Make changes
git add .                     # Stage
git commit -m "message"       # Commit
git push origin main          # Push
```

---

## 🚀 Ready to Push?

Run these commands in order:

```bash
# 1. Check status
git status

# 2. Add files
git add .

# 3. Commit
git commit -m "Initial commit: SQL-Flow platform"

# 4. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/sqlflow.git

# 5. Push
git branch -M main
git push -u origin main
```

**Done! Your code is now on GitHub! 🎉**

Next: Follow `QUICK_DEPLOY.md` to deploy to Render and Vercel.
