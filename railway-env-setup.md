# Railway Environment Variables Setup - Step by Step

## Current Issue
Your backend is running but can't connect to the database. This means the environment variables are not set correctly.

## Step 1: Check Your Railway Project Structure

Make sure you have:
1. **MySQL Service** in your Railway project
2. **Backend Service** in your Railway project
3. Both services should be in the same project

## Step 2: Set Environment Variables Manually

### Option A: If you have separate MySQL and Backend services

1. Go to your Railway project dashboard
2. Click on your **Backend service** (not the MySQL service)
3. Go to the **"Variables"** tab
4. Add these environment variables one by one:

```
MYSQLHOST=mysql.railway.internal
MYSQLUSER=root
MYSQLPASSWORD=yOfGsPARwIzAmnqzxcdjAqqcNmNxsWCX
MYSQLDATABASE=railway
MYSQLPORT=3306
NODE_ENV=production
```

### Option B: If you want Railway to auto-detect

1. Make sure both MySQL and Backend services are in the same project
2. Railway should automatically share environment variables
3. If not working, use Option A above

## Step 3: Verify Environment Variables

After setting the variables:

1. **Redeploy your backend service**
2. **Check the logs** - you should see:
   ```
   Environment variables check:
   MYSQLHOST: mysql.railway.internal
   MYSQLUSER: root
   MYSQLPASSWORD: ***SET***
   MYSQLDATABASE: railway
   MYSQLPORT: 3306
   ```

## Step 4: Test Connection

1. Visit your health check endpoint: `https://your-app.railway.app/api/health`
2. You should see: `{"status":"OK","message":"Server is running and database is connected"}`

## Troubleshooting

### If environment variables show "NOT SET":
- Go back to Step 2 and add them manually
- Make sure you're adding them to the **Backend service**, not the MySQL service

### If you see connection errors:
- Check that the MySQL service is running
- Verify the password is correct
- Make sure both services are in the same Railway project

### If you still have issues:
1. Check Railway logs for specific error messages
2. Try using the external connection string:
   ```
   MYSQLHOST=shortline.proxy.rlwy.net
   MYSQLPORT=40133
   MYSQLUSER=root
   MYSQLPASSWORD=yOfGsPARwIzAmnqzxcdjAqqcNmNxsWCX
   MYSQLDATABASE=railway
   ```

## Quick Fix Commands

If you want to quickly test, you can also try setting these variables:

```
DB_HOST=mysql.railway.internal
DB_USER=root
DB_PASSWORD=yOfGsPARwIzAmnqzxcdjAqqcNmNxsWCX
DB_NAME=railway
DB_PORT=3306
NODE_ENV=production
```

The backend supports both naming conventions. 