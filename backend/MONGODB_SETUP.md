# 🍃 MongoDB Setup Guide for SQL-Flow

Your SQL-Flow application is currently running **without MongoDB**. Here's how to get the database connected for full functionality.

## 🚀 Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create Free Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Configure Network Access**
   - Go to "Network Access" in Atlas
   - Click "Add IP Address"
   - Add `0.0.0.0/0` for testing (or your specific IP)

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `sqlflow-user`
   - Password: Generate a secure password
   - Give "Read and write to any database" permissions

4. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your user password

5. **Update Environment Variables**
   ```bash
   # In backend/.env
   MONGO_URI=mongodb+srv://sqlflow-user:<password>@cluster0.xxxxx.mongodb.net/sqlflow?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

#### Windows:
```bash
# Download MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Or use Chocolatey
choco install mongodb

# Start MongoDB
net start MongoDB
```

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu):
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 3: Docker (Easiest for Development)

```bash
# Run MongoDB in Docker
docker run -d \
  --name sqlflow-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:latest

# Update backend/.env
MONGO_URI_LOCAL=mongodb://admin:password123@localhost:27017/sqlflow?authSource=admin
```

## 🧪 Test Your Connection

After setting up MongoDB, test the connection:

```bash
# In the backend directory
npm run test-db
```

Or check the health endpoint:
```bash
curl http://localhost:5000/api/health
```

## ✅ What Works Without MongoDB

Your SQL-Flow app is fully functional for learning even without MongoDB:

- ✅ **SQL Lessons** - All lesson content
- ✅ **Interactive Exercises** - Practice SQL queries
- ✅ **SQL Workspace** - Execute queries against sample databases
- ✅ **Glossary** - SQL terminology and concepts
- ✅ **Interview Prep** - SQL interview questions

## 🔒 What Requires MongoDB

These features need a database connection:

- ❌ **User Accounts** - Registration and login
- ❌ **Progress Tracking** - Save lesson completion
- ❌ **Achievements** - Unlock badges and rewards
- ❌ **Analytics** - Usage statistics and insights

## 🛠️ Troubleshooting

### Connection Issues:
1. **Check firewall settings** - Ensure port 27017 is open
2. **Verify credentials** - Username/password must be correct
3. **Network access** - Atlas requires IP whitelisting
4. **Connection string format** - Must be properly formatted

### Common Errors:
- `ENOTFOUND` - DNS resolution failed (check internet/Atlas URL)
- `ECONNREFUSED` - MongoDB not running locally
- `Authentication failed` - Wrong username/password
- `IP not whitelisted` - Add your IP to Atlas network access

### Still Having Issues?

1. **Check logs** - Look at backend console output
2. **Test connection** - Use MongoDB Compass or CLI
3. **Restart services** - Restart both backend and MongoDB
4. **Check environment** - Verify `.env` file is correct

## 🎯 Recommended Setup

For **development**: Use Docker or local MongoDB
For **production**: Use MongoDB Atlas

Your SQL-Flow application will automatically detect when MongoDB is available and enable all features!