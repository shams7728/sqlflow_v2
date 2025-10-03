#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking for sensitive files before Git push..."
echo ""

# Check for .env files
echo "Checking for .env files..."
if git ls-files | grep -q "\.env"; then
    echo -e "${RED}❌ ERROR: .env files found in git!${NC}"
    git ls-files | grep "\.env"
    echo "Run: git rm --cached <file>"
    exit 1
else
    echo -e "${GREEN}✅ No .env files tracked${NC}"
fi

# Check for node_modules
echo "Checking for node_modules..."
if git ls-files | grep -q "node_modules"; then
    echo -e "${RED}❌ ERROR: node_modules found in git!${NC}"
    echo "Run: git rm -r --cached node_modules"
    exit 1
else
    echo -e "${GREEN}✅ No node_modules tracked${NC}"
fi

# Check for database files
echo "Checking for database files..."
if git ls-files | grep -q "\.db$"; then
    echo -e "${YELLOW}⚠️  WARNING: Database files found${NC}"
    git ls-files | grep "\.db$"
fi

# Check for large files
echo "Checking for large files (>10MB)..."
large_files=$(git ls-files | xargs ls -l 2>/dev/null | awk '$5 > 10485760 {print $9, $5}')
if [ ! -z "$large_files" ]; then
    echo -e "${YELLOW}⚠️  WARNING: Large files found:${NC}"
    echo "$large_files"
fi

# Check repository size
echo "Checking repository size..."
repo_size=$(du -sh . | cut -f1)
echo "Repository size: $repo_size"

echo ""
echo -e "${GREEN}✅ All checks passed! Safe to push to GitHub.${NC}"
echo ""
echo "Next steps:"
echo "  git add ."
echo "  git commit -m 'Initial commit: SQL-Flow platform'"
echo "  git push origin main"
