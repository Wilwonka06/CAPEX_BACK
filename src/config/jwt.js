/**
 * Configuración de JWT
 * Maneja la configuración segura de JWT_SECRET
 */

/**
 * Obtener el secreto JWT de forma segura
 * @returns {string} El secreto JWT
 */
function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    console.error('❌ ERROR: JWT_SECRET no está configurado en las variables de entorno');
    console.error('   Por favor, configura JWT_SECRET en tu archivo .env');
    console.error('   Ejemplo: JWT_SECRET=mi_secreto_super_seguro_y_unico_123456789');
    
    // En desarrollo, usar un secreto temporal pero más seguro
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Usando secreto temporal para desarrollo. NO usar en producción.');
      return 'dev_secret_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    }
    
    // En producción, no permitir continuar sin JWT_SECRET
    throw new Error('JWT_SECRET no está configurado. La aplicación no puede iniciar sin esta variable.');
  }
  
 /*  // Validar que el secreto tenga al menos 32 caracteres
  if (secret.length < 32) {
    console.warn('⚠️  ADVERTENCIA: JWT_SECRET es muy corto. Se recomienda al menos 32 caracteres.');
  }
   */
  return secret;
}

/**
 * Configuración de JWT
 */
const jwtConfig = {
  secret: getJWTSecret(),
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  algorithm: 'HS256'
};

module.exports = jwtConfig;
