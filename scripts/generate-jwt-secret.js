const crypto = require('crypto');

/**
 * Script para generar un JWT_SECRET seguro
 * Ejecutar: node scripts/generate-jwt-secret.js
 */

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generateReadableSecret(length = 50) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

console.log('🔐 Generador de JWT_SECRET Seguro');
console.log('=====================================\n');

// Generar secreto hexadecimal (más seguro)
const hexSecret = generateSecureSecret(64);
console.log('📝 JWT_SECRET (Hexadecimal - Recomendado):');
console.log(`JWT_SECRET=${hexSecret}\n`);

// Generar secreto legible (alternativa)
const readableSecret = generateReadableSecret(50);
console.log('📝 JWT_SECRET (Legible - Alternativa):');
console.log(`JWT_SECRET=${readableSecret}\n`);

console.log('📋 Instrucciones:');
console.log('1. Copia uno de los valores anteriores');
console.log('2. Pégalo en tu archivo .env');
console.log('3. Asegúrate de que el archivo .env esté en .gitignore');
console.log('4. Nunca compartas o subas el JWT_SECRET a repositorios públicos\n');

console.log('⚠️  IMPORTANTE:');
console.log('- Usa un JWT_SECRET diferente para cada entorno (desarrollo, producción, etc.)');
console.log('- El secreto debe tener al menos 32 caracteres');
console.log('- Mantén el secreto seguro y no lo compartas');
console.log('- En producción, usa variables de entorno del servidor, no archivos .env');
