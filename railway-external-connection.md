# Railway External MySQL Connection Setup

## Your Connection Details

**Public URL**: `mysql://root:yOfGsPARwIzAmnqzxcdjAqqcNmNxsWCX@shortline.proxy.rlwy.net:40133/railway`

**Host**: `shortline.proxy.rlwy.net`
**Port**: `40133`
**User**: `root`
**Password**: `yOfGsPARwIzAmnqzxcdjAqqcNmNxsWCX`
**Database**: `railway`

## Environment Variables to Set

In your Railway backend service, set these environment variables:

```
MYSQLHOST=shortline.proxy.rlwy.net
MYSQLPORT=40133
MYSQLUSER=root
MYSQLPASSWORD=yOfGsPARwIzAmnqzxcdjAqqcNmNxsWCX
MYSQLDATABASE=railway
NODE_ENV=production
```

## How to Set Environment Variables

1. Go to your Railway project dashboard
2. Click on your **Backend service**
3. Go to the **"Variables"** tab
4. Add each environment variable:
   - Click "New Variable"
   - Enter the name (e.g., `MYSQLHOST`)
   - Enter the value (e.g., `shortline.proxy.rlwy.net`)
   - Click "Add"

## Alternative: Use DB_ Variables

If the MYSQL_ variables don't work, try these instead:

```
DB_HOST=shortline.proxy.rlwy.net
DB_PORT=40133
DB_USER=root
DB_PASSWORD=yOfGsPARwIzAmnqzxcdjAqqcNmNxsWCX
DB_NAME=railway
NODE_ENV=production
```

## Test Your Connection

After setting the environment variables:

1. **Redeploy your backend service**
2. **Check the logs** - you should see:
   ```
   Environment variables check:
   MYSQLHOST: shortline.proxy.rlwy.net
   MYSQLUSER: root
   MYSQLPASSWORD: ***SET***
   MYSQLDATABASE: railway
   MYSQLPORT: 40133
   Database config: {
     host: 'shortline.proxy.rlwy.net',
     user: 'root',
     database: 'railway',
     port: 40133
   }
   Database connected successfully
   ✅ Database initialized successfully
   ```

3. **Visit your health check endpoint**: `https://your-app.railway.app/api/health`
4. **You should see**: `{"status":"OK","message":"Server is running and database is connected"}`

## Why Use External Connection?

The external connection (`shortline.proxy.rlwy.net:40133`) is accessible from your backend service, while the internal connection (`mysql.railway.internal:3306`) might not be available if the services aren't properly linked.

## Troubleshooting

### If you still see connection errors:
1. **Check Railway logs** for specific error messages
2. **Verify the password** is correct (no extra spaces)
3. **Make sure the port** is set to `40133` (not 3306)
4. **Test the connection** using the raw MySQL command:
   ```bash
   mysql -h shortline.proxy.rlwy.net -u root -p yOfGsPARwIzAmnqzxcdjAqqcNmNxsWCX --port 40133 --protocol=TCP railway
   ```

### If the connection works locally but not in Railway:
- The external connection should work from Railway
- Make sure you're using the external host and port
- Check that your Railway service has outbound internet access 