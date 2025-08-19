/**
 * Middleware de seguridad básica para la API
 * Este middleware implementa protecciones básicas contra ataques comunes
 * y puede ser extendido según las necesidades específicas del proyecto
 */
class SecurityMiddleware {
  /**
   * Middleware para prevenir ataques de inyección de contenido
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static preventContentInjection(req, res, next) {
    // Prevenir inyección de scripts en headers
    const userAgent = req.headers['user-agent'] || '';
    const contentType = req.headers['content-type'] || '';
    
    // Verificar si hay scripts en User-Agent
    if (userAgent.includes('<script>') || userAgent.includes('javascript:')) {
      return res.status(400).json({
        success: false,
        message: 'User-Agent inválido',
        error: 'INVALID_USER_AGENT',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
    
    // Verificar Content-Type para requests POST/PUT
    if ((req.method === 'POST' || req.method === 'PUT') && 
        contentType && 
        !contentType.includes('application/json') && 
        !contentType.includes('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type no permitido',
        error: 'INVALID_CONTENT_TYPE',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
    
    next();
  }

  /**
   * Middleware para sanitizar parámetros de query
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static sanitizeQueryParams(req, res, next) {
    // Sanitizar parámetros de query
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        // Remover caracteres peligrosos
        req.query[key] = req.query[key]
          .replace(/[<>]/g, '') // Remover < y >
          .replace(/javascript:/gi, '') // Remover javascript:
          .replace(/on\w+=/gi, '') // Remover event handlers
          .trim();
      }
    });
    
    next();
  }

  /**
   * Middleware para sanitizar parámetros de URL
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static sanitizeUrlParams(req, res, next) {
    // Sanitizar parámetros de URL
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key]
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '')
          .trim();
      }
    });
    
    next();
  }

  /**
   * Middleware para prevenir ataques de enumeración
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static preventEnumeration(req, res, next) {
    // Agregar delay aleatorio para prevenir timing attacks
    const randomDelay = Math.random() * 100; // 0-100ms
    setTimeout(next, randomDelay);
  }

  /**
   * Middleware para validar tamaño de payload
   * @param {number} maxSize - Tamaño máximo en bytes
   * @returns {Function} Middleware de validación
   */
  static validatePayloadSize(maxSize = 1024 * 1024) { // 1MB por defecto
    return (req, res, next) => {
      const contentLength = parseInt(req.headers['content-length'] || '0');
      
      if (contentLength > maxSize) {
        return res.status(413).json({
          success: false,
          message: 'El payload excede el tamaño máximo permitido',
          error: 'PAYLOAD_TOO_LARGE',
          maxSize,
          receivedSize: contentLength,
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        });
      }
      
      next();
    };
  }

  /**
   * Middleware para prevenir ataques de fuerza bruta básicos
   * @param {Object} options - Opciones de configuración
   * @returns {Function} Middleware de protección
   */
  static preventBruteForce(options = {}) {
    const {
      maxAttempts = 5,
      windowMs = 15 * 60 * 1000, // 15 minutos
      blockDuration = 30 * 60 * 1000 // 30 minutos
    } = options;
    
    const attempts = new Map();
    
    return (req, res, next) => {
      const clientIP = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      
      // Limpiar intentos antiguos
      if (attempts.has(clientIP)) {
        const clientAttempts = attempts.get(clientIP);
        clientAttempts.attempts = clientAttempts.attempts.filter(
          timestamp => now - timestamp < windowMs
        );
        
        if (clientAttempts.attempts.length === 0) {
          attempts.delete(clientIP);
        }
      }
      
      // Verificar si el cliente está bloqueado
      if (attempts.has(clientIP)) {
        const clientAttempts = attempts.get(clientIP);
        if (clientAttempts.blockedUntil && now < clientAttempts.blockedUntil) {
          return res.status(429).json({
            success: false,
            message: 'Demasiados intentos. Intente más tarde.',
            error: 'RATE_LIMITED',
            retryAfter: Math.ceil((clientAttempts.blockedUntil - now) / 1000),
            timestamp: new Date().toISOString(),
            path: req.originalUrl
          });
        }
      }
      
      // Registrar intento
      if (!attempts.has(clientIP)) {
        attempts.set(clientIP, { attempts: [now] });
      } else {
        attempts.get(clientIP).attempts.push(now);
      }
      
      // Verificar si excede el límite
      const clientAttempts = attempts.get(clientIP);
      if (clientAttempts.attempts.length >= maxAttempts) {
        clientAttempts.blockedUntil = now + blockDuration;
        return res.status(429).json({
          success: false,
          message: 'Demasiados intentos. Intente más tarde.',
          error: 'RATE_LIMITED',
          retryAfter: Math.ceil(blockDuration / 1000),
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        });
      }
      
      next();
    };
  }

  /**
   * Middleware para agregar headers de seguridad
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static addSecurityHeaders(req, res, next) {
    // Headers de seguridad adicionales
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
  }
}

module.exports = SecurityMiddleware;
