# 💬 Real-Time Chat Application with Socket.io

![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/Frontend-React-blue.svg)
![Node](https://img.shields.io/badge/Backend-Node.js-yellow.svg)
![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-black.svg)

This is a full-stack real-time chat application built with **React**, **Express**, and **Socket.io**, completed as part of **Week 5 Assignment** in the Power Learn Project MERN Stack course.

---

## 🚀 Features Implemented

### ✅ **Task 1: Basic Chat Functionality**
- Global chat messages with live delivery using WebSockets
- Users can join and leave the chat room
- Username input and display
- Persistent chat state per session

### ✅ **Task 2: Typing Indicators**
- Real-time typing notifications
- Displays “User is typing…” below the chat area
- Optimized to prevent constant socket emission

### ✅ **Task 3: Private Messaging**
- One-to-one private messages between users
- Select user from the online list to chat privately
- Messages tagged with “(Private)” label

### ✅ **Task 4: Notifications**
- Desktop browser notifications for private messages (when tab is hidden)
- Notification sound (uses `public/notification.mp3`)
- Auto title change: shows unread message count in browser tab

### ✅ **Task 5: UX and Performance Improvements**
- Message delivery confirmation using callback acknowledgment
- Handles socket disconnection/reconnection with logs
- Clears unread count when user returns to tab
- Optimized scrolling/chat history and consistent feedback

---

## 🧠 Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | React (Vite), HTML, CSS |
| Backend   | Node.js, Express   |
| Realtime  | Socket.io (v4)     |
| Notifications | Web API (Notifications, Audio) |

---

## 📂 Project Structure

socketio-chat/
├── client/
│ ├── public/
│ │ └── notification.mp3
│ └── src/
│ └── App.js
├── server/
│ └── server.js
└── README.md



---

## 🛠️ Getting Started Locally

### ⚙️ Prerequisites

- Node.js v18+
- npm or yarn
- Modern browser

---

### 📦 Installation Steps

1. **Clone the repository**  
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/week-5-web-sockets-assignment-Alana303.git
   cd week-5-web-sockets-assignment-Alana303


Start the backend server

cd server
npm install
npm run dev   # or: node server.js
Start the frontend client


cd client
npm install
npm run dev
Visit your app at: http://localhost:5173


 Author: Jeff Amayo
Full-Stack Developer in Training
GitHub Profile: https://github.com/PLP-MERN-Stack-Development/week-5-web-sockets-assignment-Alana303.git

