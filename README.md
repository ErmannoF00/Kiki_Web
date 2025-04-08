# 🎁Kiki's Website 

A multifunctional and interactive web app created as a Christmas gift.

---

## Features


- 🏠 **Home Page** – Protected by a password, leading to your private world.
- 💌 **Letterbox** – Stylish animated envelope to read and save letters with optional images.
- 🖼️ **Gallery** – Upload, drag and reorder, and view your favorite photos with beautiful animations.
- 💬 **WebChat** – A WhatsApp-style chat with second-level password protection and persistent messages.
- 🎮 **Game Room** – Real-time couple game selector with online presence detection and external games.
- 🔐 **Two-Level Privacy** – First access via main password, second level (e.g. webchat) has its own.

## 🧠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** JSONBin (via secure backend API)
- **Real-time:** WebSockets for the Game Room
- **Deployment:** GitHub Pages (frontend) + Render (backend)

## 📂 Structure

```

Kiki_Web/
│
├── front/
│   ├── gallery/
│   ├── letterbox/
│   ├── gameroom/
│   ├── webchat/
│   ├── home/
│   └── images/
│
├── backend/
│   └── server.js
│
├── index.html
└── README.md
```

## 🚀 How to Run

### 1. Clone the repository
```bash
git clone https://github.com/ErmannoF00/Kiki_Web.git
```

### 2. Run the backend (Render or local)
Make sure you have Node.js installed, then:

```bash
cd backend
npm install
node server.js
```

The backend connects to JSONBin and handles secure data syncing.

### 3. Deploy frontend
Upload the `Kiki_Web` project (excluding `backend`) to GitHub Pages or serve it locally.

---



## 📌 TODO

- [x] Protect chat with second password
- [x] Persistent chat messages
- [x] Real-time game room with shared selection
- [x] Romantic letterbox with animations
- [ ] Audio/video support in chat
- [ ] More games and surprises

---


Let me know if you want to add screenshots, badges, or a live demo link!

