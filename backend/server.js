const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket for Game Room
let clients = [];

wss.on("connection", (ws) => {
  const user = { ws, game: null };
  clients.push(user);

  broadcastOnline();

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "game-selection") {
      user.game = data.game;
    }
    broadcastState();
  });

  ws.on("close", () => {
    clients = clients.filter((u) => u.ws !== ws);
    broadcastOnline();
    broadcastState();
  });
});

function broadcastOnline() {
  const onlineCount = clients.length;
  clients.forEach(({ ws }) => {
    ws.send(JSON.stringify({ type: "presence", count: onlineCount }));
  });
}

function broadcastState() {
  const states = clients.map((u) => u.game);
  clients.forEach(({ ws }) => {
    ws.send(JSON.stringify({ type: "games", games: states }));
  });
}

// JSONBin API
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const LETTERS_BIN_ID = process.env.LETTERS_BIN_ID;
const IMAGES_BIN_ID = process.env.IMAGES_BIN_ID;
const BASE_URL = "https://api.jsonbin.io/v3/b";

const jsonBinHeaders = {
  "X-Master-Key": JSONBIN_API_KEY,
  "Content-Type": "application/json",
};

// GET images
app.get("/api/images", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${IMAGES_BIN_ID}/latest`, {
      headers: jsonBinHeaders,
    });
    res.json(data.record);
  } catch (err) {
    console.error("Failed to fetch images:", err.message);
    res.status(500).json({ error: "Unable to fetch gallery." });
  }
});

// PUT images
app.put("/api/images", async (req, res) => {
  try {
    await axios.put(`${BASE_URL}/${IMAGES_BIN_ID}`, req.body, {
      headers: jsonBinHeaders,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save images:", err.message);
    res.status(500).json({ error: "Unable to save gallery." });
  }
});

// Letters endpoints (unchanged)
app.get("/api/letters", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${LETTERS_BIN_ID}/latest`, {
      headers: jsonBinHeaders,
    });
    res.json(data.record);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch letters." });
  }
});

app.put("/api/letters", async (req, res) => {
  try {
    await axios.put(`${BASE_URL}/${LETTERS_BIN_ID}`, req.body, {
      headers: jsonBinHeaders,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Unable to save letters." });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`✅ Backend server on port ${PORT}`));
