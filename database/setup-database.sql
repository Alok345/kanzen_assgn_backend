-- Run this script to set up your database
-- From terminal: mysql -u root -p < setup-database.sql

-- Create database
CREATE DATABASE IF NOT EXISTS mesothelioma_claims;
USE mesothelioma_claims;

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Insert sample data for testing
INSERT INTO form_submissions (full_name, email, message) VALUES 
('Jane Smith', 'jane.smith@email.com', '{"firstName":"Jane","lastName":"Smith","phoneNumber":"555-0123","email":"jane.smith@email.com","dateOfBirth":"1965-03-15","dateOfDiagnosis":"2023-08-20","jobTitle":"Factory Worker","typeOfDiagnosis":"pleural-mesothelioma","story":"I worked in a factory for 30 years and was exposed to asbestos daily.","agreeToTerms":true,"verifyHuman":true}'),
('Robert Johnson', 'robert.j@email.com', '{"firstName":"Robert","lastName":"Johnson","phoneNumber":"555-0456","email":"robert.j@email.com","dateOfBirth":"1958-11-22","dateOfDiagnosis":"2023-09-10","jobTitle":"Construction Worker","typeOfDiagnosis":"peritoneal-mesothelioma","story":"Worked in construction for 40 years, exposed to asbestos in building materials.","agreeToTerms":true,"verifyHuman":true}');

-- Show tables to verify
SHOW TABLES;

-- Show sample data
SELECT * FROM form_submissions;
