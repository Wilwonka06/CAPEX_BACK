// Middleware de autenticación temporal
// TODO: Implementar autenticación real con JWT

const authenticateToken = (req, res, next) => {
  // Por ahora, permitir todas las peticiones sin autenticación
  // TODO: Implementar verificación de token JWT
  next();
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    // Por ahora, permitir todas las peticiones sin verificación de permisos
    // TODO: Implementar verificación de permisos basada en roles
    next();
  };
};

module.exports = {
  authenticateToken,
  requirePermission
};
