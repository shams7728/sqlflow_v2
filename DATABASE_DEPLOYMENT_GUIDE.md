# Database Files Deployment Guide

## 🎯 The Issue

Your app uses SQLite `.db` files in `backend/lesson-data/` for:

- Lesson content storage
- SQL query execution
- Practice exercises

**Without these files on Render, your app will crash!**

## ✅ Solution 1: Upload .db Files (RECOMMENDED)

### Why This is Safe:

- ✅ These are **lesson content** files (like textbooks)
- ✅ They contain **sample data** for learning
- ✅ They're **read-only** in production
- ✅ No user data or secrets
- ✅ Same for all users

### What I Did:

Updated `.gitignore` to **allow** lesson database files:

```gitignore
# User databases excluded
*.sqlite
*.sqlite3

# Lesson databases INCLUDED (safe - they're content, not user data)
# backend/lesson-data/*.db - Allowed
```

### Verify:

```bash
# These files SHOULD be tracked:
git status | grep "lesson-data"

# You should see:
# backend/lesson-data/lesson_select.db
# backend/lesson-data/lesson_where.db
# etc.
```

### Commit and Push:

```bash
git add backend/lesson-data/*.db
git commit -m "Add lesson database files for deployment"
git push origin main
```

---

## 🔄 Solution 2: Generate .db Files on Startup (Alternative)

If you prefer not to upload .db files, generate them from JSON:

### Step 1: Create Generation Script

**File**: `backend/scripts/generate-lesson-dbs.js`

```javascript
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const lessonsDir = path.join(__dirname, "../lesson-content");
const dataDir = path.join(__dirname, "../lesson-data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Get all lesson JSON files
const lessonFiles = fs
  .readdirSync(lessonsDir)
  .filter((file) => file.endsWith(".json"));

console.log(`Found ${lessonFiles.length} lesson files`);

lessonFiles.forEach((file) => {
  const lessonPath = path.join(lessonsDir, file);
  const lesson = JSON.parse(fs.readFileSync(lessonPath, "utf8"));

  if (!lesson.schema || !lesson.sample_data) {
    console.log(`Skipping ${file} - no schema/data`);
    return;
  }

  const dbName = file.replace(".json", ".db");
  const dbPath = path.join(dataDir, dbName);

  // Create database
  const db = new sqlite3.Database(dbPath);

  // Create tables from schema
  lesson.schema.tables.forEach((table) => {
    const columns = table.columns
      .map((col) => `${col.name} ${col.type} ${col.constraints || ""}`)
      .join(", ");

    const createSQL = `CREATE TABLE IF NOT EXISTS ${table.name} (${columns})`;
    db.run(createSQL);
  });

  // Insert sample data
  Object.keys(lesson.sample_data).forEach((tableName) => {
    const rows = lesson.sample_data[tableName];
    if (rows && rows.length > 0) {
      const columns = Object.keys(rows[0]);
      const placeholders = columns.map(() => "?").join(", ");
      const insertSQL = `INSERT INTO ${tableName} (${columns.join(
        ", "
      )}) VALUES (${placeholders})`;

      const stmt = db.prepare(insertSQL);
      rows.forEach((row) => {
        stmt.run(Object.values(row));
      });
      stmt.finalize();
    }
  });

  db.close();
  console.log(`✅ Generated ${dbName}`);
});

console.log("✅ All lesson databases generated!");
```

### Step 2: Update package.json

```json
{
  "scripts": {
    "start": "node server.js",
    "postinstall": "node scripts/generate-lesson-dbs.js"
  }
}
```

### Step 3: Update render.yaml

```yaml
services:
  - type: web
    name: sqlflow-backend
    env: node
    buildCommand: cd backend && npm install && node scripts/generate-lesson-dbs.js
    startCommand: cd backend && node server.js
```

---

## 📊 Comparison

### Solution 1: Upload .db Files

**Pros:**

- ✅ Simple and straightforward
- ✅ Faster deployment (no generation time)
- ✅ No additional code needed
- ✅ Guaranteed to work

**Cons:**

- ⚠️ Larger repository size (~50MB)
- ⚠️ Must re-commit when updating lessons

**Best for:** Your use case (lesson content files)

### Solution 2: Generate on Startup

**Pros:**

- ✅ Smaller repository
- ✅ Automatic updates from JSON

**Cons:**

- ❌ More complex
- ❌ Slower deployment
- ❌ Potential generation errors
- ❌ Requires additional code

**Best for:** Frequently changing data

---

## 🎯 My Recommendation

**Use Solution 1** (Upload .db files) because:

1. **They're lesson content** - Like uploading images or PDFs
2. **Read-only** - No user data stored
3. **Stable** - Don't change often
4. **Reliable** - No generation errors
5. **Fast** - Instant deployment

## ✅ What to Do Now

### Step 1: Verify .gitignore

```bash
cat .gitignore | grep "lesson-data"
# Should NOT exclude lesson-data/*.db
```

### Step 2: Check Files

```bash
git status
# Should show lesson database files as untracked or modified
```

### Step 3: Add and Commit

```bash
git add backend/lesson-data/*.db
git commit -m "Add lesson database files for deployment"
```

### Step 4: Push

```bash
git push origin main
```

### Step 5: Deploy to Render

- Render will now have all lesson databases
- SQL queries will work correctly
- No crashes!

---

## 🧪 Test After Deployment

### Test Endpoint:

```bash
curl https://your-backend.onrender.com/api/execute \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"lessonId":"select","query":"SELECT * FROM employees LIMIT 5"}'
```

**Expected:** Returns employee data
**If error:** Database files missing

---

## 📝 Important Notes

### These .db Files Are Safe Because:

1. **No user data** - Only lesson content
2. **No passwords** - Just sample data
3. **No secrets** - Public information
4. **Read-only** - Not modified by users
5. **Same for everyone** - Shared content

### Still Excluded:

- ❌ User progress databases
- ❌ Authentication databases
- ❌ Any .sqlite or .sqlite3 files

---

## 🆘 Troubleshooting

### If SQL queries fail on Render:

1. Check if .db files are in repository
2. Verify they're not in .gitignore
3. Ensure they're pushed to GitHub
4. Check Render logs for file access errors

### If repository is too large:

1. Check .db file sizes: `ls -lh backend/lesson-data/*.db`
2. If >100MB total, use Solution 2 (generate on startup)
3. Or compress databases: `sqlite3 file.db "VACUUM;"`

---

## ✨ Summary

**I've updated your .gitignore to allow lesson database files.**

Now you can:

```bash
git add backend/lesson-data/*.db
git commit -m "Add lesson databases"
git push origin main
```

Your app will work perfectly on Render! 🚀
