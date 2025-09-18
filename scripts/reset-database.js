const { exec } = require('child_process');

async function resetDatabase() {
  console.log('🗑️  Limpiando base de datos...\n');
  
  try {
    // Revertir todas las migraciones
    console.log('🔄 Revirtiendo todas las migraciones...');
    await executeCommand('npx sequelize-cli db:migrate:undo:all');
    
    console.log('✅ Base de datos limpiada exitosamente');
    console.log('\n💡 Ahora puedes ejecutar las migraciones en orden correcto con:');
    console.log('   node scripts/run-migrations-in-order.js');
    
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:');
    console.error(error);
  }
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando: ${command}`);
        console.error(stderr);
        reject(error);
        return;
      }
      
      console.log(stdout);
      resolve();
    });
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };
