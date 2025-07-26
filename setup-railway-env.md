# Railway Environment Variables Setup

Based on your Railway MySQL database, here are the environment variables you need to set in your backend service:

## Required Environment Variables

Set these in your Railway backend service:

```
MYSQLHOST=mysql.railway.internal
MYSQLUSER=root
MYSQLPASSWORD=yOfGsPARwIzAmnqzxcdjAqqcNmNxsWCX
MYSQLDATABASE=railway
MYSQLPORT=3306
NODE_ENV=production
```

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to the "Variables" tab
4. Add each environment variable:
   - Click "New Variable"
   - Enter the name (e.g., `MYSQLHOST`)
   - Enter the value (e.g., `mysql.railway.internal`)
   - Click "Add"

## Alternative: Use Railway's Auto-Detection

If you have both the MySQL service and your backend service in the same Railway project:

1. Railway should automatically detect the MySQL service
2. The environment variables should be automatically available
3. If not, manually add them as shown above

## Test Your Connection

After setting the environment variables:

1. Redeploy your backend service
2. Check the logs for successful database connection
3. Visit your health check endpoint: `https://your-app.railway.app/api/health`

## Expected Log Output

You should see in the logs:
```
Database config: {
  host: 'mysql.railway.internal',
  user: 'root',
  database: 'railway',
  port: 3306
}
Database connected successfully
✅ Database initialized successfully
✅ Server is running on port 5000
```

## Troubleshooting

If you still see connection errors:

1. **Check if MySQL service is running** in your Railway project
2. **Verify environment variables** are set correctly
3. **Check Railway logs** for specific error messages
4. **Ensure both services** (MySQL and backend) are in the same project 