// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 👇 Match the Expo export output: StickerSmash/dist
const buildPath = path.join(__dirname, "StickerSmash", "dist");

// Serve static assets
app.use(express.static(buildPath));

app.use((req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend running on port ${PORT}`);
});