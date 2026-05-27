// schemas.js
// Frontend copy of the Zod schemas. Use these with react-hook-form's
// zodResolver to validate the form BEFORE sending it to the backend.
// The backend re-validates with its own copy in server/schemas.js —
// never trust client validation alone.

import { z } from "zod";

export const ALLOWED_STATUSES = ["want-to-read", "reading", "read"];

export const createBookSchema = z.object({
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

export const updateBookSchema = z.object({
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
