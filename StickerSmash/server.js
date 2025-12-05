// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Expo export:web outputs to "web-build"
const buildPath = path.join(__dirname, "web-build");

// Serve static assets
app.use(express.static(buildPath));

app.use((req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend running on port ${PORT}`);
});