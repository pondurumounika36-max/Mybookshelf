// index.js
// Entry point for the MyBookShelf backend.
// - Loads environment variables from .env
// - Spins up an Express server
// - Enables CORS so the React frontend (different port) can call this API
// - Parses JSON request bodies
// - Mounts a /health endpoint for quick "is the server alive?" checks
// - Mounts the /api/books router (placeholder for now)

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const booksRouter = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check — useful for "is the server running?" tests
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "mybookshelf-server" });
});

// API routes
app.use("/api/books", booksRouter);

// Generic error handler (catches errors thrown by async route handlers
// once we add real ones later).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`MyBookShelf server listening on http://localhost:${PORT}`);
});
