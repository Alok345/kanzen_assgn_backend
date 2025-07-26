// Alternative database setup using Node.js
const mysql = require("mysql2/promise")
const dotenv = require("dotenv")

dotenv.config()

async function setupDatabase() {
  console.log("🚀 Starting database setup...")

  // First connect without specifying database
  const connectionConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: Number.parseInt(process.env.DB_PORT) || 3306,
  }

  let connection

  try {
    // Connect to MySQL server
    connection = await mysql.createConnection(connectionConfig)
    console.log("✅ Connected to MySQL server")

    // Create database
    await connection.execute("CREATE DATABASE IF NOT EXISTS mesothelioma_claims")
    console.log("✅ Database 'mesothelioma_claims' created/verified")

    // Use the database
    await connection.execute("USE mesothelioma_claims")
    console.log("✅ Using database 'mesothelioma_claims'")

    // Create table
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
    console.log("✅ Table 'form_submissions' created/verified")

    // Insert sample data
    const sampleData = [
      [
        "Jane Smith",
        "jane.smith@email.com",
        '{"firstName":"Jane","lastName":"Smith","phoneNumber":"555-0123","email":"jane.smith@email.com","dateOfBirth":"1965-03-15","dateOfDiagnosis":"2023-08-20","jobTitle":"Factory Worker","typeOfDiagnosis":"pleural-mesothelioma","story":"I worked in a factory for 30 years and was exposed to asbestos daily.","agreeToTerms":true,"verifyHuman":true}',
      ],
      [
        "Robert Johnson",
        "robert.j@email.com",
        '{"firstName":"Robert","lastName":"Johnson","phoneNumber":"555-0456","email":"robert.j@email.com","dateOfBirth":"1958-11-22","dateOfDiagnosis":"2023-09-10","jobTitle":"Construction Worker","typeOfDiagnosis":"peritoneal-mesothelioma","story":"Worked in construction for 40 years, exposed to asbestos in building materials.","agreeToTerms":true,"verifyHuman":true}',
      ],
    ]

    // Check if sample data already exists
    const [existingRows] = await connection.execute("SELECT COUNT(*) as count FROM form_submissions")
    if (existingRows[0].count === 0) {
      for (const data of sampleData) {
        await connection.execute("INSERT INTO form_submissions (full_name, email, message) VALUES (?, ?, ?)", data)
      }
      console.log("✅ Sample data inserted")
    } else {
      console.log("ℹ️  Sample data already exists, skipping insertion")
    }

    // Verify setup
    const [tables] = await connection.execute("SHOW TABLES")
    console.log(
      "📋 Tables in database:",
      tables.map((t) => Object.values(t)[0]),
    )

    const [rows] = await connection.execute("SELECT COUNT(*) as total FROM form_submissions")
    console.log(`📊 Total records in form_submissions: ${rows[0].total}`)

    console.log("🎉 Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }
