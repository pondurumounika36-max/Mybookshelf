// api/books.js
// Thin wrapper around axios for talking to the backend /api/books endpoints.
// Each function returns a Promise that resolves to the response data.
// You'll call these from inside useQuery / useMutation hooks in components.
//
// Where does the backend live?
//   - In development: VITE_API_URL is NOT set, so baseURL is just "/api".
//     The Vite proxy in vite.config.js forwards "/api" -> http://localhost:4000.
//   - In production (the deployed build): VITE_API_URL is set to the Render
//     backend URL (see client/.env.production), so requests go straight to
//     e.g. https://mybookshelf-okln.onrender.com/api.
//
// import.meta.env is how Vite exposes environment variables to the browser.
// Only variables that start with "VITE_" are made available here.

import axios from "axios";

// If VITE_API_URL is provided, talk to "<that URL>/api"; otherwise fall back
// to the relative "/api" path that the dev proxy handles.
const apiBaseUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Fetch books, optionally filtered by status ("reading", "completed", "wishlist").
// If `status` is missing or "all", we send no query param and get every book back.
// Otherwise axios appends e.g. "?status=reading" to the URL for the backend to filter on.
export async function getBooks(status) {
  const params = status && status !== "all" ? { status } : {};
  const { data } = await api.get("/books", { params });
  return data;
}

export async function createBook(book) {
  const { data } = await api.post("/books", book);
  return data;
}

export async function updateBook(id, updates) {
  const { data } = await api.patch(`/books/${id}`, updates);
  return data;
}

export async function deleteBook(id) {
  const { data } = await api.delete(`/books/${id}`);
  return data;
}
