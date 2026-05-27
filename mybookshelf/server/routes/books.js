// routes/books.js
// Router for /api/books — handles list, create, update, delete.
// All input is validated with Zod (see ../schemas.js) before it touches
// the database. Prisma queries use the shared client from ../db.js.

const express = require("express");

const prisma = require("../db");
const { createBookSchema, updateBookSchema, ALLOWED_STATUSES } = require("../schemas");

const router = express.Router();

// Helper: turn a Zod error into a { fieldName: ["message"] } shape so the
// frontend can display each message next to its input. The client checks
// error.response.data.details for this exact format.
function zodToDetails(zodError) {
  return zodError.flatten().fieldErrors;
}

// GET /api/books — list books, newest first.
// Optional ?status=... query param filters by status. We only accept values
// in ALLOWED_STATUSES — anything else is ignored (treated as "no filter")
// so a typo in the URL just returns everything instead of an error.
router.get("/", async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = ALLOWED_STATUSES.includes(status) ? { status } : {};

    const books = await prisma.book.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// POST /api/books — create a new book.
router.post("/", async (req, res, next) => {
  // safeParse returns { success, data | error } instead of throwing.
  const parsed = createBookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid book data",
      details: zodToDetails(parsed.error),
    });
  }

  try {
    const book = await prisma.book.create({ data: parsed.data });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/books/:id — partial update.
router.patch("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid book id" });
  }

  const parsed = updateBookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid book data",
      details: zodToDetails(parsed.error),
    });
  }

  try {
    const book = await prisma.book.update({
      where: { id },
      data: parsed.data,
    });
    res.json(book);
  } catch (err) {
    // Prisma throws P2025 when the row doesn't exist — treat that as 404.
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Book not found" });
    }
    next(err);
  }
});

// DELETE /api/books/:id — remove a book.
router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid book id" });
  }

  try {
    await prisma.book.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Book not found" });
    }
    next(err);
  }
});

module.exports = router;
