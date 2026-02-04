# Habit Tracker - Complete Setup Guide

## 🎯 Current Status

✅ **Backend Dependencies**: Installed  
✅ **Frontend Dependencies**: Installed  
✅ **MongoDB Configuration**: Configured  
⚠️ **MongoDB Connection**: Needs IP Whitelisting

---

## 🔧 MongoDB Atlas Setup (IMPORTANT!)

Your MongoDB connection is configured, but you need to **whitelist your IP address** in MongoDB Atlas:

### Steps to Whitelist Your IP:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in with your credentials
3. Select your project (Cluster0)
4. Click on **"Network Access"** in the left sidebar
5. Click **"Add IP Address"**
6. Choose one of these options:
   - **Option 1 (Recommended for development)**: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Option 2**: Add your current IP address
7. Click **"Confirm"**
8. Wait 1-2 minutes for the changes to take effect

---

## 🚀 Running Your Habit Tracker

### Option 1: Run Both Frontend and Backend Together

Open **TWO separate terminals**:

**Terminal 1 - Backend Server:**
```bash
cd "C:\Users\DHARANI\Desktop\Habbit Tracker\server"
npm start
```

**Terminal 2 - Frontend Development Server:**
```bash
cd "C:\Users\DHARANI\Desktop\Habbit Tracker"
npm run dev
```

### Option 2: Use the Startup Script

Simply run:
```bash
cd "C:\Users\DHARANI\Desktop\Habbit Tracker"
.\start-app.bat
```

---

## 📊 Verifying MongoDB Connection

After whitelisting your IP, test the connection:

```bash
cd "C:\Users\DHARANI\Desktop\Habbit Tracker\server"
node test-connection.js
```

You should see:
```
✅ MongoDB Connected Successfully!
📊 Database Name: habitflow
🔗 Host: cluster0.zksez7g.mongodb.net
```

---

## 🌐 Accessing Your Application

Once both servers are running:

- **Frontend**: http://localhost:5173 (or the port shown in terminal)
- **Backend API**: http://localhost:5000
- **API Test**: http://localhost:5000/ (should show "HabitFlow API is Running")

---

## 📁 Project Structure

```
Habbit Tracker/
├── server/                 # Backend (Express + MongoDB)
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── .env              # Environment variables (MongoDB URI)
│   └── server.js         # Main server file
├── src/                   # Frontend (React + Vite)
│   ├── components/       # React components
│   ├── services/         # API service layer
│   └── App.jsx           # Main app component
└── package.json          # Frontend dependencies
```

---

## 💾 Database Collections

Your MongoDB database `habitflow` will store:

- **Users**: User profiles
- **Habits**: Daily habit tracking data
- **Exams**: Exam schedules
- **StudyPlans**: Study planning data
- **SpecialTasks**: Special task items

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: "Could not connect to any servers"
- **Solution**: Whitelist your IP address in MongoDB Atlas (see above)

**Error**: "Authentication failed"
- **Solution**: Verify your username and password in `.env` file

### Port Already in Use

**Error**: "Port 5000 is already in use"
- **Solution**: Kill the process or change PORT in `.env` file

### Frontend Can't Connect to Backend

- Verify backend is running on port 5000
- Check `src/services/api.js` has correct API_URL
- Check browser console for CORS errors

---

## 📝 Environment Variables

Located in `server/.env`:

```
MONGODB_URI=mongodb+srv://dharshinibala001_db_user:GVbrMaW0C916JsEJ@cluster0.zksez7g.mongodb.net/habitflow
PORT=5000
```

---

## ✨ Features

- ✅ Habit tracking with calendar view
- ✅ Multiple user profiles
- ✅ Exam scheduler
- ✅ Study plan management
- ✅ Special tasks sidebar
- ✅ MongoDB data persistence
- ✅ Real-time updates

---

## 🎨 Next Steps

1. **Whitelist your IP** in MongoDB Atlas
2. **Start both servers** (backend + frontend)
3. **Open** http://localhost:5173 in your browser
4. **Create a user profile** and start tracking habits!

---

## 📞 Need Help?

If you encounter any issues:
1. Check that MongoDB Atlas IP is whitelisted
2. Verify both servers are running
3. Check terminal for error messages
4. Ensure all dependencies are installed (`npm install`)
