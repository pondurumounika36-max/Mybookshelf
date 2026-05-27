// db.js
// Creates a single shared PrismaClient instance for the whole app.
// Importing this file anywhere gives you the same client, which
// avoids opening multiple database connections.

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
