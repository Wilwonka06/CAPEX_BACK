const ResponseMiddleware = require('../ResponseMiddleware');

/**
 * Middleware de validación para autenticación
 */
class AuthValidationMiddleware {

  /**
   * Validar datos para registro de usuario
   */
  static validateRegister(req, res, next) {
    try {
      // Validar que req.body existe
      if (!req.body) {
        return ResponseMiddleware.sendError(res, 400, 'Datos del cuerpo de la petición no encontrados');
      }

      // Verificar Content-Type
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        return ResponseMiddleware.sendError(res, 400, 'Content-Type debe ser application/json');
      }

      // Validar campos requeridos
      const camposRequeridos = ['nombre', 'tipo_documento', 'documento', 'telefono', 'correo', 'contrasena'];
      const camposFaltantes = camposRequeridos.filter(campo => !req.body[campo]);
      
      if (camposFaltantes.length > 0) {
        return ResponseMiddleware.sendError(res, 400, `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`);
      }

      // Extraer valores después de validar que existen
      const nombre = req.body.nombre;
      const tipo_documento = req.body.tipo_documento;
      const documento = req.body.documento;
      const telefono = req.body.telefono;
      const correo = req.body.correo;
      const contrasena = req.body.contrasena;

      // Validar longitud del nombre
      if (nombre.length < 2 || nombre.length > 100) {
        return ResponseMiddleware.sendError(res, 400, 'El nombre debe tener entre 2 y 100 caracteres');
      }

      // Validar que el nombre solo contenga letras y espacios
      const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
      if (!nombreRegex.test(nombre)) {
        return ResponseMiddleware.sendError(res, 400, 'El nombre solo puede contener letras y espacios');
      }

      // Validar tipo de documento
      const tiposDocumentoValidos = ['Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'];
      if (!tiposDocumentoValidos.includes(tipo_documento)) {
        return ResponseMiddleware.sendError(res, 400, 'Tipo de documento no válido. Valores permitidos: Pasaporte, Cedula de ciudadania, Cedula de extranjeria');
      }

      // Validar formato del documento
      if (documento.length < 5 || documento.length > 20) {
        return ResponseMiddleware.sendError(res, 400, 'El documento debe tener entre 5 y 20 caracteres');
      }

      // Validar que el documento solo contenga letras y números
      const documentoRegex = /^[A-Za-z0-9]+$/;
      if (!documentoRegex.test(documento)) {
        return ResponseMiddleware.sendError(res, 400, 'El documento solo puede contener letras y números');
      }

      // Validar formato del teléfono
      const phoneRegex = /^\+[0-9]{7,15}$/;
      if (!phoneRegex.test(telefono)) {
        return ResponseMiddleware.sendError(res, 400, 'Formato de teléfono no válido. Debe comenzar con + y tener entre 7 y 15 dígitos');
      }

      // Validar formato del correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        return ResponseMiddleware.sendError(res, 400, 'Formato de correo electrónico no válido');
      }

      // Validar contraseña
      if (contrasena.length < 8) {
        return ResponseMiddleware.sendError(res, 400, 'La contraseña debe tener al menos 8 caracteres');
      }

      // Validar que la contraseña contenga al menos una mayúscula, una minúscula, un número y un carácter especial
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
      if (!passwordRegex.test(contrasena)) {
        return ResponseMiddleware.sendError(res, 400, 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%?&)');
      }

      next();
    } catch (error) {
      console.error('Error en validación de registro:', error);
      return ResponseMiddleware.sendError(res, 500, `Error en la validación de datos: ${error.message}`);
    }
  }

  /**
   * Validar datos para login - VERSIÓN SIMPLIFICADA
   */
  static validateLogin(req, res, next) {
    try {
      console.log('🔍 [DEBUG] Iniciando validación de login');
      console.log('🔍 [DEBUG] req.body:', JSON.stringify(req.body, null, 2));
      console.log('🔍 [DEBUG] req.headers:', JSON.stringify(req.headers, null, 2));
      
      // Validación básica
      if (!req.body) {
        console.log('❌ [DEBUG] req.body no existe');
        return res.status(400).json({
          success: false,
          message: 'Datos del cuerpo de la petición no encontrados',
          timestamp: new Date().toISOString()
        });
      }

      // Verificar campos requeridos
      if (!req.body.correo) {
        console.log('❌ [DEBUG] Campo correo faltante');
        return res.status(400).json({
          success: false,
          message: 'Campo correo es requerido',
          timestamp: new Date().toISOString()
        });
      }

      if (!req.body.contrasena) {
        console.log('❌ [DEBUG] Campo contrasena faltante');
        return res.status(400).json({
          success: false,
          message: 'Campo contrasena es requerido',
          timestamp: new Date().toISOString()
        });
      }

      console.log('✅ [DEBUG] Validación de login exitosa');
      next();
      
    } catch (error) {
      console.error('❌ [DEBUG] Error en validación de login:', error);
      return res.status(500).json({
        success: false,
        message: `Error en la validación de datos: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Validar datos para editar perfil del usuario logueado
   */
  static validateEditProfile(req, res, next) {
    try {
      // Validar que req.body existe
      if (!req.body) {
        return ResponseMiddleware.sendError(res, 400, 'Datos del cuerpo de la petición no encontrados');
      }

      // Verificar Content-Type
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        return ResponseMiddleware.sendError(res, 400, 'Content-Type debe ser application/json');
      }

      // Validar que al menos un campo esté presente
      const camposPermitidos = ['foto', 'nombre', 'tipo_documento', 'documento', 'telefono', 'correo', 'contrasena'];
      const camposPresentes = camposPermitidos.filter(campo => req.body.hasOwnProperty(campo));
      
      if (camposPresentes.length === 0) {
        return ResponseMiddleware.sendError(res, 400, 'Al menos un campo debe ser proporcionado para actualizar');
      }

      // Extraer valores
      const { foto, nombre, tipo_documento, documento, telefono, correo, contrasena } = req.body;

      // Validar nombre si está presente
      if (nombre !== undefined) {
        if (!nombre || nombre.trim() === '') {
          return ResponseMiddleware.sendError(res, 400, 'El nombre no puede estar vacío');
        }
        
        if (nombre.length < 2 || nombre.length > 100) {
          return ResponseMiddleware.sendError(res, 400, 'El nombre debe tener entre 2 y 100 caracteres');
        }

        const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
        if (!nombreRegex.test(nombre)) {
          return ResponseMiddleware.sendError(res, 400, 'El nombre solo puede contener letras y espacios');
        }
      }

      // Validar tipo de documento si está presente
      if (tipo_documento !== undefined) {
        const tiposDocumentoValidos = ['Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'];
        if (!tiposDocumentoValidos.includes(tipo_documento)) {
          return ResponseMiddleware.sendError(res, 400, 'Tipo de documento no válido. Valores permitidos: Pasaporte, Cedula de ciudadania, Cedula de extranjeria');
        }
      }

      // Validar documento si está presente
      if (documento !== undefined) {
        if (!documento || documento.trim() === '') {
          return ResponseMiddleware.sendError(res, 400, 'El documento no puede estar vacío');
        }
        
        if (documento.length < 5 || documento.length > 20) {
          return ResponseMiddleware.sendError(res, 400, 'El documento debe tener entre 5 y 20 caracteres');
        }

        const documentoRegex = /^[A-Za-z0-9]+$/;
        if (!documentoRegex.test(documento)) {
          return ResponseMiddleware.sendError(res, 400, 'El documento solo puede contener letras y números');
        }
      }

      // Validar teléfono si está presente
      if (telefono !== undefined) {
        if (!telefono || telefono.trim() === '') {
          return ResponseMiddleware.sendError(res, 400, 'El teléfono no puede estar vacío');
        }
        
        const phoneRegex = /^\+[0-9]{7,15}$/;
        if (!phoneRegex.test(telefono)) {
          return ResponseMiddleware.sendError(res, 400, 'Formato de teléfono no válido. Debe comenzar con + y tener entre 7 y 15 dígitos');
        }
      }

      // Validar correo si está presente
      if (correo !== undefined) {
        if (!correo || correo.trim() === '') {
          return ResponseMiddleware.sendError(res, 400, 'El correo no puede estar vacío');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
          return ResponseMiddleware.sendError(res, 400, 'Formato de correo electrónico no válido');
        }
      }

      // Validar contraseña si está presente
      if (contrasena !== undefined) {
        if (!contrasena || contrasena.trim() === '') {
          return ResponseMiddleware.sendError(res, 400, 'La contraseña no puede estar vacía');
        }
        
        if (contrasena.length < 8) {
          return ResponseMiddleware.sendError(res, 400, 'La contraseña debe tener al menos 8 caracteres');
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
        if (!passwordRegex.test(contrasena)) {
          return ResponseMiddleware.sendError(res, 400, 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%?&)');
        }
      }

      // Validar foto si está presente (opcional)
      if (foto !== undefined && foto !== null && foto !== '') {
        // Aquí podrías agregar validaciones específicas para la foto
        // Por ejemplo, validar formato, tamaño, etc.
        if (typeof foto !== 'string') {
          return ResponseMiddleware.sendError(res, 400, 'La foto debe ser una URL válida');
        }
      }

      next();
    } catch (error) {
      console.error('Error en validación de edición de perfil:', error);
      return ResponseMiddleware.sendError(res, 500, `Error en la validación de datos: ${error.message}`);
    }
  }
}

module.exports = AuthValidationMiddleware;
