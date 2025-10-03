# Browser Cache & Project Cleanup Guide

## 🚀 Quick Clean (Recommended)

### Method 1: Use the Cleanup Script
```bash
# Run this from project root
clean-and-restart.bat
```

This will:
- ✅ Stop all Node servers
- ✅ Clean build files
- ✅ Clean cache directories
- ✅ Restart both servers
- ✅ Open browser

### Method 2: Manual Browser Cache Clear

**Chrome/Edge/Brave:**
1. Press `Ctrl + Shift + Delete`
2. Select time range: "All time"
3. Check these boxes:
   - ✅ Browsing history
   - ✅ Cookies and other site data
   - ✅ Cached images and files
4. Click "Clear data"

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Select time range: "Everything"
3. Check:
   - ✅ Cookies
   - ✅ Cache
4. Click "Clear Now"

## 🧹 Deep Clean (If having issues)

### Step 1: Stop All Servers
```bash
# Windows
taskkill /F /IM node.exe

# Or close the terminal windows running npm start
```

### Step 2: Clean Frontend
```bash
cd frontend

# Remove build files
rmdir /s /q build

# Remove cache
rmdir /s /q node_modules\.cache
rmdir /s /q .cache

# Optional: Full reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Step 3: Clean Backend
```bash
cd backend

# Remove cache
rmdir /s /q node_modules\.cache

# Optional: Full reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Step 4: Clear Browser Storage

**Open DevTools (F12) → Application Tab:**
1. Clear Storage:
   - ✅ Local storage
   - ✅ Session storage
   - ✅ IndexedDB
   - ✅ Cookies
   - ✅ Cache storage
2. Click "Clear site data"

### Step 5: Hard Refresh
- Press `Ctrl + F5` (Windows)
- Or `Ctrl + Shift + R`
- Or right-click refresh → "Empty Cache and Hard Reload"

## 🔄 Fresh Start Commands

### Clean Everything and Restart
```bash
# 1. Stop servers
taskkill /F /IM node.exe

# 2. Clean frontend
cd frontend
rmdir /s /q build node_modules\.cache .cache

# 3. Clean backend  
cd ..\backend
rmdir /s /q node_modules\.cache

# 4. Start backend
cd backend
npm start

# 5. Start frontend (new terminal)
cd frontend
npm start

# 6. Clear browser cache (Ctrl+Shift+Delete)

# 7. Open in incognito mode
# Chrome: Ctrl+Shift+N
# Firefox: Ctrl+Shift+P
```

## 🌐 Browser-Specific Instructions

### Chrome/Edge
```
1. Settings → Privacy and security → Clear browsing data
2. Advanced tab
3. Time range: All time
4. Check all boxes
5. Clear data
```

### Firefox
```
1. Options → Privacy & Security
2. Cookies and Site Data → Clear Data
3. History → Clear Recent History
4. Time range: Everything
5. Check all boxes
6. Clear Now
```

### Brave
```
1. Settings → Privacy and security
2. Clear browsing data
3. Advanced
4. All time
5. Clear data
```

## 🎯 Quick Fixes for Common Issues

### "Module not found" errors
```bash
cd frontend
rmdir /s /q node_modules
npm install
```

### "Port already in use"
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Stale data showing
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear localStorage:
   ```javascript
   // In browser console (F12)
   localStorage.clear();
   sessionStorage.clear();
   ```
3. Hard refresh (Ctrl+F5)

### React not updating
```bash
cd frontend
rmdir /s /q node_modules\.cache
rmdir /s /q build
npm start
```

## 🔍 Verify Clean State

### Check if cache is cleared:
1. Open DevTools (F12)
2. Network tab
3. Check "Disable cache"
4. Refresh page
5. All files should show "200" status (not "304 Not Modified")

### Check localStorage:
```javascript
// In browser console
console.log(localStorage);
console.log(sessionStorage);
// Should be empty or only have essential data
```

### Check running processes:
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000
# Should show nothing if servers are stopped
```

## 📋 Cleanup Checklist

Before testing new features:
- [ ] Stop all Node servers
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Clear localStorage/sessionStorage
- [ ] Delete frontend/build folder
- [ ] Delete cache folders
- [ ] Hard refresh browser (Ctrl+F5)
- [ ] Or use Incognito mode

## 🎉 Best Practice

**For testing new features:**
1. Use Incognito/Private mode
2. This ensures:
   - ✅ No cached files
   - ✅ No stored cookies
   - ✅ No localStorage data
   - ✅ Fresh session every time

**Keyboard shortcuts:**
- Chrome: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`
- Edge: `Ctrl + Shift + N`

## 🚨 Nuclear Option (Last Resort)

If nothing works:
```bash
# 1. Stop everything
taskkill /F /IM node.exe

# 2. Delete everything
cd frontend
rmdir /s /q node_modules build .cache
del package-lock.json

cd ..\backend
rmdir /s /q node_modules
del package-lock.json

# 3. Reinstall everything
cd ..\frontend
npm install

cd ..\backend
npm install

# 4. Clear ALL browser data
# Settings → Clear browsing data → All time → Everything

# 5. Restart computer (yes, really!)

# 6. Start fresh
cd backend
npm start

cd ..\frontend
npm start
```

## ✅ Success Indicators

After cleaning, you should see:
- ✅ No console errors
- ✅ Fresh data loading
- ✅ No "304 Not Modified" in Network tab
- ✅ All API calls returning fresh data
- ✅ No stale UI components

---

**Quick Command Reference:**
- Clear cache: `Ctrl + Shift + Delete`
- Hard refresh: `Ctrl + F5`
- Incognito: `Ctrl + Shift + N`
- DevTools: `F12`
- Stop Node: `taskkill /F /IM node.exe`
