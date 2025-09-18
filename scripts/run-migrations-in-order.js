const { exec } = require('child_process');
const path = require('path');

// Orden correcto de las migraciones basado en dependencias
const migrationOrder = [
  '20250829135609-create-roles-table.js',
  '20250829135610-create-permissions-table.js',
  '20250829135610-create-privileges-table.js',
  '20250829135611-create-role-permission-privilege-table.js',
  '20250829135612-create-service-categories-table.js',
  '20250829135613-create-services-table.js',
  '20250829135614-create-users-table.js',
  '20250829135615-create-user-roles-table.js',
  '20250829135616-create-client-table.js',
  '20250829135617-create-product-categories-table.js',
  '20250829135618-create-products-table.js',
  '20250829135618-create-suppliers-table.js',
  '20250829135619-create-characteristics-table.js',
  '20250829135620-create-technical-sheets-table.js',
  '20250829135621-create-scheduling-table.js',
  '20250829135622-add-foto-to-users.js',
  '20250829135623-add-estado-to-users.js',
  '20250829135624-add-direccion-to-users.js',
  '20250830000001-update-users-estado-and-add-concepto.js',
  '20250830000002-remove-client-table.js',
  '20250101000001-remove-client-table.js',
  '20250101000003-create-citas-table.js',
  '20250101000004-update-detalles-servicios-table.js'
];

async function runMigration(migrationFile) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 Ejecutando migración: ${migrationFile}`);
    
    const command = `npx sequelize-cli db:migrate --to ${migrationFile}`;
    
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error en migración ${migrationFile}:`);
        console.error(stderr);
        reject(error);
        return;
      }
      
      console.log(`✅ Migración ${migrationFile} completada exitosamente`);
      console.log(stdout);
      resolve();
    });
  });
}

async function runMigrationsInOrder() {
  console.log('🚀 Iniciando ejecución de migraciones en orden correcto...\n');
  
  try {
    for (const migrationFile of migrationOrder) {
      await runMigration(migrationFile);
      // Pequeña pausa entre migraciones
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 Todas las migraciones se han ejecutado exitosamente en el orden correcto!');
  } catch (error) {
    console.error('\n💥 Error durante la ejecución de migraciones:');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runMigrationsInOrder();
}

module.exports = { runMigrationsInOrder, migrationOrder };
