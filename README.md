# Chatting App Frontend

This is the frontend application for the Chatting App, built with **React**, **Capacitor**, and **Socket.io-client**. It supports chat and voice calls on **web** and **mobile**.

## Features

- User registration and login
- Real-time chat messaging
- Voice calls using WebRTC and Socket.io signaling
- Mobile-ready using Capacitor

## Prerequisites

- Node.js >= 18
- npm >= 9
- Android Studio (for Android build)
- Xcode (for iOS build, Mac only)

## Setup

1. Clone the repository:

```bash
git clone <your-frontend-repo-url>
cd chat-frontend

Install dependencies:

npm install


Add environment variables:

Create .env in root:

REACT_APP_API_URL=http://localhost:3000


Run the app (development):

npm start


Add Android/iOS platform (Capacitor):

npx cap add android
npx cap add ios


Open in IDE:

npx cap open android
npx cap open ios


Build for Android/iOS:

npm run build
npx cap copy
npx cap sync


APK location: android/app/build/outputs/apk/debug/app-debug.apk

Folder Structure
chat-frontend/
├── public/          # Public assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # App pages/screens
│   ├── services/    # API and Socket.io services
│   ├── App.js
│   └── index.js
├── android/         # Capacitor Android project
├── ios/             # Capacitor iOS project
├── package.json
└── capacitor.config.json

License
com.palzone.com
