const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const axios = require("axios");
const { google } = require("googleapis");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet()); // Add security headers

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket Game Room
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

// JSONBin API Keys
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const LETTERS_BIN_ID = process.env.LETTERS_BIN_ID;
const IMAGES_BIN_ID = process.env.IMAGES_BIN_ID;
const BASE_URL = "https://api.jsonbin.io/v3/b";

const jsonBinHeaders = {
  "X-Master-Key": JSONBIN_API_KEY,
  "Content-Type": "application/json",
};

// Google Drive Authentication
async function authenticateGoogleDrive() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "path-to-your-service-account-file.json", // Your Google service account file
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
  return await auth.getClient();
}

// Upload Image to Google Drive
async function uploadImageToDrive(base64Image, fileName) {
  try {
    const auth = await authenticateGoogleDrive();
    const driveService = google.drive({ version: "v3", auth });

    // Convert base64 string to buffer
    const buffer = Buffer.from(base64Image.split(",")[1], "base64");

    const fileMetadata = {
      name: fileName,
      parents: ["1wDTQl4oN6ayHfzHXPrEY9AyPwq6OAOja"], // Your folder ID on Google Drive
    };

    const media = {
      mimeType: "image/jpeg", // Assuming all images are jpeg; adjust if necessary
      body: buffer,
    };

    const res = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log("File uploaded to Drive with ID:", res.data.id);
    return `https://drive.google.com/uc?id=${res.data.id}`; // Return the Google Drive image URL
  } catch (err) {
    console.error("Error uploading file to Google Drive:", err.message);
    throw new Error("Failed to upload image to Google Drive");
  }
}

// GET images
app.get("/api/images", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${IMAGES_BIN_ID}/latest`, {
      headers: jsonBinHeaders,
    });
    res.json(data.record); // This returns an array of base64 images or URLs (Google Drive URLs)
  } catch (err) {
    console.error("❌ Failed to fetch images:", err.message);
    res.status(500).json({ error: "Unable to fetch gallery." });
  }
});

// PUT images
// PUT images
app.put("/api/images", async (req, res) => {
  try {
    const newImages = req.body; // Expecting an array of base64 image strings
    if (!Array.isArray(newImages) || !newImages.every(img => typeof img === "string")) {
      return res.status(400).json({ error: "Invalid image data format." });
    }

    // First, save to JSONBin
    await axios.put(`${BASE_URL}/${IMAGES_BIN_ID}`, { record: newImages }, {
      headers: jsonBinHeaders,
    });

    // Then, upload each image to Google Drive and collect URLs
    const imageUrls = [];
    for (let image of newImages) {
      const imageUrl = await uploadImageToDrive(image, `image_${Date.now()}.jpg`);
      imageUrls.push(imageUrl); // Store Google Drive URL
    }

    // Return the URLs after uploading to Google Drive
    res.json({ success: true, imageUrls });
  } catch (err) {
    console.error("❌ Error saving images to JSONBin and uploading to Google Drive:", err.message);
    res.status(500).json({ error: "Unable to save gallery and upload images." });
  }
});


// DELETE images from JSONBin and Google Drive
app.delete("/api/images/:imageId", async (req, res) => {
  const { imageId } = req.params;
  try {
    // First, remove the image from JSONBin
    const { data } = await axios.get(`${BASE_URL}/${IMAGES_BIN_ID}/latest`, {
      headers: jsonBinHeaders,
    });
    const updatedImages = data.record.filter((image) => image.id !== imageId);

    await axios.put(`${BASE_URL}/${IMAGES_BIN_ID}`, { record: updatedImages }, {
      headers: jsonBinHeaders,
    });

    // Then, delete the image from Google Drive
    await deleteImageFromDrive(imageId);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete image:", err.message);
    res.status(500).json({ error: "Unable to delete image." });
  }
});

// Function to delete image from Google Drive
async function deleteImageFromDrive(fileId) {
  try {
    const auth = await authenticateGoogleDrive();
    const driveService = google.drive({ version: "v3", auth });

    await driveService.files.delete({ fileId });
    console.log("File deleted from Google Drive.");
  } catch (err) {
    console.error("Error deleting file from Google Drive:", err.message);
    throw new Error("Failed to delete file from Google Drive");
  }
}

// GET letters
app.get("/api/letters", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${LETTERS_BIN_ID}/latest`, {
      headers: jsonBinHeaders,
    });
    res.json(data.record); // Return the letters data from JSONBin
  } catch (err) {
    console.error("❌ Failed to fetch letters:", err.message);
    res.status(500).json({ error: "Unable to fetch letters." });
  }
});

// PUT letters
app.put("/api/letters", async (req, res) => {
  try {
    await axios.put(`${BASE_URL}/${LETTERS_BIN_ID}`, req.body, {
      headers: jsonBinHeaders,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving letters to JSONBin:", err.message);
    res.status(500).json({ error: "Unable to save letters." });
  }
});

// Rate limiting for /api routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter); // Apply rate limit to all /api routes

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`✅ Backend server on port ${PORT}`));
