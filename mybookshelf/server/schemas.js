// schemas.js
// Zod schemas describe the shape of incoming request bodies.
// We use them to validate user input BEFORE it touches the database.
// - createBookSchema: every required field must be present.
// - updateBookSchema: every field is optional (you might only edit one).

const { z } = require("zod");

const ALLOWED_STATUSES = ["want-to-read", "reading", "read"];

const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long (max 200 characters)"),
  author: z.string().min(1, "Author is required").max(100, "Author is too long (max 100 characters)"),
  genre: z.string().max(50, "Genre is too long (max 50 characters)").optional(),
  rating: z.number({ invalid_type_error: "Rating must be a number" })
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5")
    .optional(),
  status: z.enum(ALLOWED_STATUSES, {
    invalid_type_error: "Please choose a valid status",
    required_error: "Status is required",
  }).default("want-to-read"),
  metadata: z.record(z.any()).optional(),
});

const updateBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long (max 200 characters)").optional(),
  author: z.string().min(1, "Author is required").max(100, "Author is too long (max 100 characters)").optional(),
  genre: z.string().max(50, "Genre is too long (max 50 characters)").optional(),
  rating: z.number({ invalid_type_error: "Rating must be a number" })
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5")
    .optional(),
  status: z.enum(ALLOWED_STATUSES, {
    invalid_type_error: "Please choose a valid status",
  }).optional(),
  metadata: z.record(z.any()).optional(),
});

module.exports = {
  createBookSchema,
  updateBookSchema,
  ALLOWED_STATUSES,
};
