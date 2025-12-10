# MERN Stack with Google OAuth

A full-stack MERN (MongoDB, Express, React, Node.js) application with Google OAuth authentication.

## Features

✨ **Authentication**
- Google OAuth 2.0 login
- JWT-based authentication
- Session management
- Protected routes

🎨 **Frontend**
- Modern React application
- Responsive design
- Beautiful UI with animations
- User profile display

🔧 **Backend**
- Express.js REST API
- MongoDB database
- Passport.js authentication
- Secure session handling

## Project Structure

```
RPL/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── server.js          # Server entry point
│   ├── .env.example       # Environment variables template
│   └── package.json
└── .github/
    └── copilot-instructions.md
```

## Technology Stack

- **MongoDB** - NoSQL database
- **Express.js** - Backend web framework
- **React** - Frontend library
- **Node.js** - JavaScript runtime

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) installed and running
- Google Cloud Console account for OAuth credentials

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:5000/auth/google/callback`
7. Copy your Client ID and Client Secret

### 2. Backend Configuration

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_db

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# JWT & Session
JWT_SECRET=your-random-jwt-secret-key
SESSION_SECRET=your-random-session-secret-key

# Client URL
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Linux/Mac
mongod

# Or if using MongoDB as a service
sudo systemctl start mongodb
```

### 4. Run the Application

You need to run both the backend and frontend servers.

#### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

#### Start the Frontend (in a new terminal)

```bash
cd client
npm start
```

The React app will start on `http://localhost:3000`

## Available Scripts

### Backend (server/)

- `npm start` - Run the server in production mode
- `npm run dev` - Run the server in development mode with nodemon

### Frontend (client/)

- `npm start` - Run the React app in development mode
- `npm run build` - Build the app for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Endpoints

### Authentication Routes
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/logout` - Logout user
- `GET /auth/user` - Get current user info

### Health Check
- `GET /` - Welcome message
- `GET /api/health` - Server health status

## Authentication Flow

1. User clicks "Continue with Google" on login page
2. Redirected to Google OAuth consent screen
3. After approval, Google redirects back to `/auth/google/callback`
4. Backend creates/finds user in MongoDB
5. JWT token is generated and sent to frontend
6. Token is stored in localStorage
7. User is redirected to home page
8. Navbar displays user info with avatar

## Project Features

- ✅ Google OAuth 2.0 authentication
- ✅ JWT token-based authorization
- ✅ User session management
- ✅ Login/Logout functionality
- ✅ Protected routes
- ✅ User profile display with avatar

## Development

### Adding New API Routes

1. Create a new route file in `server/routes/`
2. Create corresponding controller in `server/controllers/`
3. Import and use the route in `server/server.js`

### Adding Database Models

1. Create a new model file in `server/models/`
2. Define your schema using Mongoose
3. Export the model

### Frontend Development

The React app uses a proxy to connect to the backend. API calls can be made using:

```javascript
import axios from 'axios';

// This will proxy to http://localhost:5000/api/health
axios.get('/api/health');
```

## Troubleshooting

### Google OAuth Error
- Verify Client ID and Secret in `.env`
- Check authorized redirect URIs in Google Console
- Ensure URLs match exactly (including http/https)

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify port 27017 is available

### Token Issues
- Clear localStorage and try again
- Check JWT_SECRET is set in `.env`
- Verify token hasn't expired

### CORS Errors
- Ensure CLIENT_URL in `.env` matches frontend URL
- Check CORS configuration in server.js

## Next Steps

1. Configure Google OAuth credentials in `.env`
2. Start MongoDB service
3. Test the login flow
4. Customize the UI components
5. Add more protected routes
6. Implement additional features (profile editing, etc.)
7. Deploy to production

## Security Notes

- Never commit `.env` files
- Use strong secrets for JWT and sessions
- Enable HTTPS in production
- Set secure cookies in production
- Regularly update dependencies

## License

This project is open source and available under the [MIT License](LICENSE).
