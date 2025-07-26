const mysql = require("mysql2/promise")
const dotenv = require("dotenv")

dotenv.config()

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mesothelioma_claims",
  port: Number.parseInt(process.env.DB_PORT) || 3306,
}

async function testConnection() {
  console.log("Testing database connection...")
  console.log("Config:", {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
  })

  try {
    const connection = await mysql.createConnection(dbConfig)
    console.log("✅ Database connection successful!")

    // Test query
    const [rows] = await connection.execute("SELECT 1 as test")
    console.log("✅ Test query successful:", rows)

    await connection.end()
    console.log("✅ Connection closed successfully")
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    process.exit(1)
  }
}

testConnection()
