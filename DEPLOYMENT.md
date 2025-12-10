# Deployment Guide

## 🚀 Pre-Deployment Checklist

Before pushing to GitHub and deploying, ensure you have:

### 1. Environment Variables Setup

#### Backend (`.env`)
Copy `server/.env.example` to `server/.env` and fill in:
```bash
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
JWT_SECRET=your-generated-jwt-secret
SESSION_SECRET=your-generated-session-secret
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Frontend (`.env`)
Copy `client/.env.example` to `client/.env`:
```bash
REACT_APP_API_URL=https://your-backend-domain.com
```

### 2. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services > Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add authorized origins and redirect URIs:

**For Production:**
- Authorized JavaScript origins: `https://your-frontend-domain.com`
- Authorized redirect URIs: `https://your-backend-domain.com/auth/google/callback`

### 3. MongoDB Setup

**For Production:**
1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all, or specific IPs)
5. Get connection string and update `MONGODB_URI`

### 4. Files Already Configured

✅ **All hardcoded URLs replaced with environment variables**
- `client/src/context/AuthContext.js`
- `client/src/pages/AdminPage.js`
- `client/src/pages/ColorPage.js`
- `client/src/pages/MiniGame.js`
- `client/src/components/ProfileSelector.js`

✅ **`.gitignore` properly configured**
- `.env` files excluded
- `node_modules/` excluded
- Build files excluded

✅ **Environment examples created**
- `server/.env.example`
- `client/.env.example`

## 📦 Deployment Platforms

### Recommended Stack:

**Backend:** Railway, Render, or Heroku
**Frontend:** Vercel, Netlify, or Railway
**Database:** MongoDB Atlas

### Backend Deployment (Railway Example)

1. Push code to GitHub
2. Go to [Railway](https://railway.app)
3. Create new project from GitHub repo
4. Select `server` as root directory
5. Add environment variables in Railway dashboard
6. Deploy

### Frontend Deployment (Vercel Example)

1. Go to [Vercel](https://vercel.com)
2. Import GitHub repository
3. Set root directory to `client`
4. Add environment variable: `REACT_APP_API_URL`
5. Build command: `npm run build`
6. Deploy

## 🔒 Security Reminders

- ⚠️ **NEVER commit `.env` files**
- ⚠️ Generate new secrets for production (don't use example values)
- ⚠️ Use HTTPS in production
- ⚠️ Restrict CORS to your frontend domain
- ⚠️ Update Google OAuth with production URLs

## 📝 Post-Deployment

1. Test Google OAuth login
2. Verify API endpoints work
3. Check database connections
4. Test all features end-to-end
5. Monitor logs for errors

## 🔍 Troubleshooting

**OAuth Redirect Error:**
- Check Google Console has correct redirect URIs
- Verify `CLIENT_URL` in backend `.env`

**CORS Error:**
- Update `CLIENT_URL` in backend to match frontend domain
- Check CORS configuration in `server.js`

**Database Connection Failed:**
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions
