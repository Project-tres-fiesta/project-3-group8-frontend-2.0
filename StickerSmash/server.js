// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const buildPath = path.join(__dirname, "dist");

app.use(express.static(buildPath));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "web-build", "index.html"));
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Frontend running on port ${PORT}`);
});