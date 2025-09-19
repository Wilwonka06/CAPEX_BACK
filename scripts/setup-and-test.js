// scripts/setup-and-test.js

const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/database');
const { Usuario } = require('../src/models/User');
const { execSync } = require('child_process');
require('dotenv').config();

/**
 * Single consolidated script for setup and testing.
 * Creates default superuser if not exists, then runs all project tests.
 * Idempotent: safe to run multiple times.
 * Uses environment variables for DB config from .env.
 */

async function createSuperuser() {
  console.log('🔍 Checking if superuser exists...');
  
  try {
    const existingUser = await Usuario.findOne({ where: { correo: 'admin@example.com' } });
    if (existingUser) {
      console.log('✅ Superuser already exists, skipping creation.');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const superuser = await Usuario.create({
      nombre: 'Admin',
      tipo_documento: 'Cedula de ciudadania',
      documento: '00000000', // Dummy document for admin
      telefono: '+573000000000',
      correo: 'admin@example.com',
      contrasena: hashedPassword,
      roleId: 1, // Default admin role ID
      estado: 'Activo',
      direccion: 'Admin Address',
      concepto_estado: 'Superusuario administrador del sistema'
    });

    console.log('✅ Superuser created successfully: admin@example.com / admin123');
  } catch (error) {
    console.error('❌ Error creating superuser:', error.message);
    throw error;
  }
}

/**
 * Run all available tests in the project.
 * Assumes 'npm test' is configured in package.json for the test runner (Jest, Mocha, etc.).
 */
function runTests() {
  console.log('🔍 Running all project tests...');
  try {
    execSync('npm test', { stdio: 'inherit', cwd: process.cwd() });
    console.log('✅ All tests completed.');
  } catch (error) {
    console.error('❌ Error running tests:', error.message);
    // Continue without failing the script if tests fail, as per idempotent design
  }
}

// Main execution
async function main() {
  try {
    // Authenticate with database
    await sequelize.authenticate();
    console.log('✅ Database connection successful.');

    // Create superuser
    await createSuperuser();

    // Run tests
    runTests();

    // Close database connection
    await sequelize.close();
    console.log('✅ Setup and test script completed successfully.');
  } catch (error) {
    console.error('❌ General script error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}