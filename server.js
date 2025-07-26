const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "http://127.0.0.1:3000",
      // Add your Vercel domain here after deployment
      process.env.FRONTEND_URL || "https://your-app.vercel.app"
    ],
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Database configuration - Support both Railway and custom environment variables
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "mesothelioma_claims",
  port: Number.parseInt(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
}

console.log("Database config:", {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port,
})

// Debug: Log all environment variables related to database
console.log("Environment variables check:")
console.log("MYSQLHOST:", process.env.MYSQLHOST)
console.log("MYSQLUSER:", process.env.MYSQLUSER)
console.log("MYSQLPASSWORD:", process.env.MYSQLPASSWORD ? "***SET***" : "NOT SET")
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE)
console.log("MYSQLPORT:", process.env.MYSQLPORT)
console.log("DB_HOST:", process.env.DB_HOST)
console.log("DB_USER:", process.env.DB_USER)
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***SET***" : "NOT SET")
console.log("DB_NAME:", process.env.DB_NAME)
console.log("DB_PORT:", process.env.DB_PORT)

// Create database connection
async function createConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    console.log("Database connected successfully")
    return connection
  } catch (error) {
    console.error("Database connection failed:", error.message)
    console.error("Full error:", error)
    throw error
  }
}

// Initialize database table
async function initializeDatabase() {
  let connection
  try {
    connection = await createConnection()

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS form_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      )
    `)
    console.log("Database table initialized successfully")
  } catch (error) {
    console.error("Failed to initialize database:", error.message)
    throw error
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Routes

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Mesothelioma Claims API Server is running",
    timestamp: new Date().toISOString(),
  })
})

app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    const connection = await createConnection()
    await connection.end()
    
    res.json({
      status: "OK",
      message: "Server is running and database is connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error.message)
    res.status(503).json({
      status: "ERROR",
      message: "Server is running but database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// POST endpoint - Submit form data
app.post("/api/form", async (req, res) => {
  let connection
  try {
    console.log("Received form submission:", req.body)

    const { fullName, email, message } = req.body

    // Validation
    if (!fullName || !email) {
      return res.status(400).json({
        error: "Full name and email are required",
        received: { fullName: !!fullName, email: !!email },
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    connection = await createConnection()

    const [result] = await connection.execute(
      "INSERT INTO form_submissions (full_name, email, message) VALUES (?, ?, ?)",
      [fullName, email, message || ""],
    )

    console.log("Form submitted successfully, ID:", result.insertId)

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      id: result.insertId,
    })
  } catch (error) {
    console.error("POST /api/form error:", error.message)
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
})

// GET endpoint - Retrieve all form submissions
app.get("/api/form", async (req, res) => {
  let connection
  try {
    connection = await createConnection()

    const [rows] = await connection.execute(
      "SELECT id, full_name, email, message, created_at FROM form_submissions ORDER BY created_at DESC",
    )

    console.log(`Retrieved ${rows.length} form submissions`)

    res.json({
      success: true,
      data: rows,
      total: rows.length,
    })
  } catch (error) {
    console.error("GET /api/form error:", error.message)
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
})

// Admin route to view submissions with parsed data
app.get("/api/admin/submissions", async (req, res) => {
  let connection
  try {
    connection = await createConnection()

    const [rows] = await connection.execute(
      "SELECT id, full_name, email, message, created_at FROM form_submissions ORDER BY created_at DESC",
    )

    // Parse message JSON for better display
    const formattedRows = rows.map((row) => {
      try {
        const parsedMessage = JSON.parse(row.message)
        return {
          ...row,
          parsedData: parsedMessage,
        }
      } catch {
        return {
          ...row,
          parsedData: { story: row.message },
        }
      }
    })

    res.json({
      success: true,
      data: formattedRows,
      total: formattedRows.length,
    })
  } catch (error) {
    console.error("GET /api/admin/submissions error:", error.message)
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  })
})

// Start server
async function startServer() {
  try {
    console.log("Starting server...")
    console.log("Environment:", process.env.NODE_ENV || "development")

    // Try to initialize database, but don't fail if it doesn't work
    try {
      await initializeDatabase()
      console.log("✅ Database initialized successfully")
    } catch (dbError) {
      console.warn("⚠️ Database initialization failed:", dbError.message)
      console.log("Server will start but database operations may fail")
    }

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`)
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
      console.log(`📝 API Base URL: http://localhost:${PORT}/api`)
      console.log(`📊 Admin URL: http://localhost:${PORT}/api/admin/submissions`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error.message)
    process.exit(1)
  }
}

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down server...")
  process.exit(0)
})

startServer()
