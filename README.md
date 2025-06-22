<!-- HEADER IMAGE -->
<p align="center">
  <img src="https://t4.ftcdn.net/jpg/06/20/09/91/360_F_620099106_87XhpxWUWwNSENwYl3mgc754k1Gpppgb.jpg" alt="QuickChat Header" width="100%" style=object-fit: cover;" />
</p>

<h1 align="center">💬 QuickChat</h1>

<p align="center">
  <strong>🔗 <a href="https://chatapp-socket-frontend.vercel.app/">Live Demo</a></strong>
</p>

<p align="center">
  A powerful real-time chat application built using the <b>MERN stack</b> and <b>Socket.IO</b>, offering user-friendly messaging with media sharing capabilities.
  <br />
  <b>Entirely deployed on <a href="https://vercel.com" target="_blank">Vercel</a> — frontend + backend</b>
</p>

---

## 🧠 Project Overview

> 🚀 **QuickChat** is my first full-stack project, crafted during my React learning journey. It’s a real-time messaging platform with profile management, user list, and media storage features — powered by cloud deployment and scalable architecture.

---

## 🚧 Features

- 🔐 **User Authentication** – Signup/Login via email and password (JWT-secured)
- 🧾 **User Directory** – Sidebar with all registered users from MongoDB
- 👤 **Profile Management** – View and update your image, bio, and name
- 💬 **Live Messaging** – Real-time chat using Socket.IO
- 🖼️ **Media Section** – Browse all shared images/docs in each chat
- ☁️ **Cloud Storage** – Integrated with Cloudinary for media handling
- 🚀 **Vercel Deployment** – Fullstack hosted (client + server) on Vercel

---

## 🛠️ Tech Stack

<div align="center">

<!-- CODE -->
<img src="https://img.shields.io/badge/Code-React-blue?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/Code-Node.js-brightgreen?style=for-the-badge&logo=nodedotjs" />
<img src="https://img.shields.io/badge/Code-Express.js-lightgrey?style=for-the-badge&logo=express" />
<img src="https://img.shields.io/badge/Code-MongoDB-brightgreen?style=for-the-badge&logo=mongodb" />
<img src="https://img.shields.io/badge/Code-Socket.IO-black?style=for-the-badge&logo=socket.io" />
<img src="https://img.shields.io/badge/Code-JavaScript-yellow?style=for-the-badge&logo=javascript" />
<img src="https://img.shields.io/badge/Code-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css" />

<!-- TOOLS -->
<img src="https://img.shields.io/badge/Tools-Vercel-black?style=for-the-badge&logo=vercel" />
<img src="https://img.shields.io/badge/Tools-Cloudinary-blue?style=for-the-badge&logo=cloudinary" />
<img src="https://img.shields.io/badge/Tools-GitHub-181717?style=for-the-badge&logo=github" />
<img src="https://img.shields.io/badge/Tools-Postman-orange?style=for-the-badge&logo=postman" />

</div>

---

## 🧩 UI Structure

### 📌 Landing Page Layout
- **Left Sidebar**: List of all users + search + edit profile + logout
- **Right Side**: Selected user’s profile info (photo, name, bio)

### 💬 Chat UI
- Chat window with live messages
- Scrollable view
- Emoji-ready and media-enabled

### 🖼️ Media Section
- Each conversation has a media viewer
- View shared **images** and **documents**

---

## 🗂️ Folder Structure

```bash
QuickChat/
├── client/               # React Frontend
│   ├── components/       # Chat UI, Auth, Sidebar, etc.
│   └── App.jsx
│
├── server/               # Express Backend
│   ├── models/           # User & Chat models
│   ├── routes/           # Auth, chat, upload
│   ├── controllers/      # Logic for routes
│   └── socket.js         # WebSocket logic
