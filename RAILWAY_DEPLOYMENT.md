# Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Database**: Set up a MySQL database (Railway, PlanetScale, or similar)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Deployment Steps

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set the **Root Directory** to `backend`

### 2. Set Environment Variables

In your Railway project settings, add these environment variables:

#### Required Database Variables:
```
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
```

#### Optional Variables:
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### 3. Database Setup Options

#### Option A: Railway MySQL Plugin
1. In your Railway project, click "New"
2. Select "Database" → "MySQL"
3. Railway will automatically set the database environment variables
4. Copy the connection details to your backend service

#### Option B: External Database (PlanetScale, etc.)
1. Get your database connection details
2. Manually set the environment variables in Railway

### 4. Deploy

1. Railway will automatically detect the Node.js project
2. It will install dependencies and start the server
3. The health check will run at `/api/health`

## Troubleshooting

### Common Issues:

1. **Health Check Fails**
   - Check that all database environment variables are set
   - Verify database connection details
   - Check Railway logs for error messages

2. **Database Connection Issues**
   - Ensure database is accessible from Railway
   - Check firewall settings
   - Verify database credentials

3. **Build Failures**
   - Check that `package.json` is in the backend directory
   - Verify all dependencies are listed in `package.json`

### Checking Logs:

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Check the logs for error messages

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DB_HOST` | Database host | Yes | `containers-us-west-1.railway.app` |
| `DB_USER` | Database username | Yes | `root` |
| `DB_PASSWORD` | Database password | Yes | `your-password` |
| `DB_NAME` | Database name | Yes | `railway` |
| `DB_PORT` | Database port | No | `3306` |
| `NODE_ENV` | Environment | No | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `https://your-app.vercel.app` |

## Testing Your Deployment

1. **Health Check**: Visit `https://your-app.railway.app/api/health`
2. **API Test**: Try submitting a form from your frontend
3. **Database**: Check that form submissions are being saved

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway) 