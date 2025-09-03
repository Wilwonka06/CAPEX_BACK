const ResponseMiddleware = require('./ResponseMiddleware');

/**
 * Middleware de validación para usuarios
 */
class UsersMiddleware {

  /**
   * Validar datos para crear usuario
   */
  static validateCreateUser(req, res, next) {
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

      const { nombre, tipo_documento, documento, telefono, correo, contrasena, foto, direccion } = req.body;

      // Validar campos requeridos
      const camposRequeridos = ['nombre', 'tipo_documento', 'documento', 'correo', 'contrasena'];
      const camposFaltantes = camposRequeridos.filter(campo => !req.body[campo]);
      
      if (camposFaltantes.length > 0) {
        return ResponseMiddleware.sendError(res, 400, `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`);
      }

      // Validar longitud del nombre
      if (nombre.length < 2 || nombre.length > 100) {
        return ResponseMiddleware.sendError(res, 400, 'El nombre debe tener entre 2 y 100 caracteres');
      }

      // Validar tipo de documento
      const tiposDocumentoValidos = ['Cedula de ciudadania', 'Cedula de extranjeria', 'Tarjeta de identidad', 'Pasaporte', 'NIT'];
      if (!tiposDocumentoValidos.includes(tipo_documento)) {
        return ResponseMiddleware.sendError(res, 400, 'Tipo de documento no válido. Valores permitidos: Cedula de ciudadania, Cedula de extranjeria, Tarjeta de identidad, Pasaporte, NIT');
      }

      // Validar formato del documento
      if (documento.length < 5 || documento.length > 20) {
        return ResponseMiddleware.sendError(res, 400, 'El documento debe tener entre 5 y 20 caracteres');
      }

      // Validar formato del teléfono (opcional)
      if (telefono) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(telefono.replace(/\s/g, ''))) {
          return ResponseMiddleware.sendError(res, 400, 'Formato de teléfono no válido');
        }
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

      // Validar que la contraseña contenga al menos una mayúscula, una minúscula y un número
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(contrasena)) {
        return ResponseMiddleware.sendError(res, 400, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número');
      }

      // Validar foto si está presente
      if (foto) {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(foto)) {
          return ResponseMiddleware.sendError(res, 400, 'La foto debe ser una URL válida que comience con http:// o https://');
        }
      }

      // Validar dirección si está presente
      if (direccion) {
        if (direccion.length > 1000) {
          return ResponseMiddleware.sendError(res, 400, 'La dirección no puede exceder los 1000 caracteres');
        }
      }

      next();
    } catch (error) {
      console.error('Error en validación de creación de usuario:', error);
      return ResponseMiddleware.sendError(res, 500, `Error en la validación de datos: ${error.message}`);
    }
  }

  /**
   * Validar datos para actualizar usuario
   */
  static validateUpdateUser(req, res, next) {
    try {
      const { nombre, tipo_documento, documento, telefono, correo, foto, direccion } = req.body;
      const userId = parseInt(req.params.id);

      // Validar ID
      if (isNaN(userId) || userId <= 0) {
        return ResponseMiddleware.sendError(res, 400, 'ID de usuario inválido');
      }

      // Validar que al menos un campo esté presente
      if (!nombre && !tipo_documento && !documento && !telefono && !correo && !foto && !direccion) {
        return ResponseMiddleware.sendError(res, 400, 'Al menos un campo debe ser proporcionado para actualizar');
      }

      // Validar nombre si está presente
      if (nombre && (nombre.length < 2 || nombre.length > 100)) {
        return ResponseMiddleware.sendError(res, 400, 'El nombre debe tener entre 2 y 100 caracteres');
      }

      // Validar tipo de documento si está presente
      if (tipo_documento) {
        const tiposDocumentoValidos = ['Cedula de ciudadania', 'Cedula de extranjeria', 'Tarjeta de identidad', 'Pasaporte', 'NIT'];
        if (!tiposDocumentoValidos.includes(tipo_documento)) {
          return ResponseMiddleware.sendError(res, 400, 'Tipo de documento no válido. Valores permitidos: Cedula de ciudadania, Cedula de extranjeria, Tarjeta de identidad, Pasaporte, NIT');
        }
      }

      // Validar documento si está presente
      if (documento && (documento.length < 5 || documento.length > 20)) {
        return ResponseMiddleware.sendError(res, 400, 'El documento debe tener entre 5 y 20 caracteres');
      }

      // Validar teléfono si está presente
      if (telefono) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(telefono.replace(/\s/g, ''))) {
          return ResponseMiddleware.sendError(res, 400, 'Formato de teléfono no válido');
        }
      }

      // Validar correo si está presente
      if (correo) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
          return ResponseMiddleware.sendError(res, 400, 'Formato de correo electrónico no válido');
        }
      }

      // Validar foto si está presente
      if (foto) {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(foto)) {
          return ResponseMiddleware.sendError(res, 400, 'La foto debe ser una URL válida que comience con http:// o https://');
        }
      }

      // Validar dirección si está presente
      if (direccion) {
        if (direccion.length > 1000) {
          return ResponseMiddleware.sendError(res, 400, 'La dirección no puede exceder los 1000 caracteres');
        }
      }

      next();
    } catch (error) {
      console.error('Error en validación de actualización de usuario:', error);
      return ResponseMiddleware.sendError(res, 500, `Error en la validación de datos: ${error.message}`);
    }
  }

  /**
   * Validar cambio de contraseña
   */
  static validateChangePassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      const userId = parseInt(req.params.id);

      // Validar ID
      if (isNaN(userId) || userId <= 0) {
        return ResponseMiddleware.sendError(res, 400, 'ID de usuario inválido');
      }

      // Validar campos requeridos
      if (!newPassword) {
        return ResponseMiddleware.sendError(res, 400, 'La nueva contraseña es requerida');
      }

      // Validar nueva contraseña
      if (newPassword.length < 8) {
        return ResponseMiddleware.sendError(res, 400, 'La nueva contraseña debe tener al menos 8 caracteres');
      }

      // Validar que la nueva contraseña contenga al menos una mayúscula, una minúscula y un número
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(newPassword)) {
        return ResponseMiddleware.sendError(res, 400, 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número');
      }

      next();
    } catch (error) {
      console.error('Error en validación de cambio de contraseña:', error);
      return ResponseMiddleware.sendError(res, 500, `Error en la validación de datos: ${error.message}`);
    }
  }

  /**
   * Validar ID de usuario
   */
  static validateUserId(req, res, next) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId) || userId <= 0) {
        return ResponseMiddleware.sendError(res, 400, 'ID de usuario inválido');
      }

      next();
    } catch (error) {
      console.error('Error en validación de ID de usuario:', error);
      return ResponseMiddleware.sendError(res, 500, `Error en la validación del ID: ${error.message}`);
    }
  }

  /**
   * Validar parámetros de búsqueda
   */
  static validateSearchParams(req, res, next) {
    try {
      const { page, limit, search, roleId, tipo_documento } = req.query;

      // Validar página
      if (page && (isNaN(page) || parseInt(page) < 1)) {
        return ResponseMiddleware.sendError(res, 400, 'El número de página debe ser un número positivo');
      }

      // Validar límite
      if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
        return ResponseMiddleware.sendError(res, 400, 'El límite debe ser un número entre 1 y 100');
      }

      // Validar roleId
      if (roleId && (isNaN(roleId) || parseInt(roleId) < 1)) {
        return ResponseMiddleware.sendError(res, 400, 'ID de rol inválido');
      }

      // Validar tipo de documento
      if (tipo_documento) {
        const tiposDocumentoValidos = ['Cedula de ciudadania', 'Cedula de extranjeria', 'Tarjeta de identidad', 'Pasaporte', 'NIT'];
        if (!tiposDocumentoValidos.includes(tipo_documento)) {
          return ResponseMiddleware.sendError(res, 400, 'Tipo de documento no válido');
        }
      }

      next();
    } catch (error) {
      console.error('Error en validación de parámetros de búsqueda:', error);
      return ResponseMiddleware.sendError(res, 500, `Error en la validación de parámetros: ${error.message}`);
    }
  }

  /**
   * Validar cambio de estado de usuario
   */
  static validateCambiarEstado(req, res, next) {
    try {
      const { nuevoEstado } = req.body;
      const userId = parseInt(req.params.id);

      // Validar ID
      if (isNaN(userId) || userId <= 0) {
        return ResponseMiddleware.sendError(res, 400, 'ID de usuario inválido');
      }

      // Validar campos requeridos
      if (!nuevoEstado) {
        return ResponseMiddleware.sendError(res, 400, 'El nuevo estado es requerido');
      }

      // Validar que el estado sea válido
      const estadosValidos = ['Activo', 'Inactivo', 'Suspendido'];
      if (!estadosValidos.includes(nuevoEstado)) {
        return ResponseMiddleware.sendError(res, 400, 'Estado no válido. Estados permitidos: Activo, Inactivo, Suspendido');
      }

      next();
    } catch (error) {
      console.error('Error en validación de cambio de estado:', error);
      return ResponseMiddleware.sendError(res, 500, `Error en la validación de datos: ${error.message}`);
    }
  }

  /**
   * Validar edición de perfil
   */
  static validateEditProfile(req, res, next) {
    try {
      const { nombre, tipo_documento, documento, telefono, correo, contrasena, foto, direccion } = req.body;
      const userId = parseInt(req.params.id);

      // Validar ID
      if (isNaN(userId) || userId <= 0) {
        return ResponseMiddleware.sendError(res, 400, 'ID de usuario inválido');
      }

      // Validar que al menos un campo esté presente
      if (!nombre && !tipo_documento && !documento && !telefono && !correo && !contrasena && !foto && !direccion) {
        return ResponseMiddleware.sendError(res, 400, 'Al menos un campo debe ser proporcionado para actualizar el perfil');
      }

      // Validar nombre si está presente
      if (nombre) {
        if (nombre.length < 2 || nombre.length > 100) {
          return ResponseMiddleware.sendError(res, 400, 'El nombre debe tener entre 2 y 100 caracteres');
        }
        // Validar que solo contenga letras, espacios y caracteres especiales del español
        const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
        if (!nombreRegex.test(nombre)) {
          return ResponseMiddleware.sendError(res, 400, 'El nombre solo puede contener letras y espacios');
        }
      }

      // Validar tipo de documento si está presente
      if (tipo_documento) {
        const tiposDocumentoValidos = ['Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'];
        if (!tiposDocumentoValidos.includes(tipo_documento)) {
          return ResponseMiddleware.sendError(res, 400, 'Tipo de documento no válido. Valores permitidos: Pasaporte, Cedula de ciudadania, Cedula de extranjeria');
        }
      }

      // Validar documento si está presente
      if (documento) {
        if (documento.length < 5 || documento.length > 20) {
          return ResponseMiddleware.sendError(res, 400, 'El documento debe tener entre 5 y 20 caracteres');
        }
        // Validar que solo contenga letras y números
        const documentoRegex = /^[A-Za-z0-9]+$/;
        if (!documentoRegex.test(documento)) {
          return ResponseMiddleware.sendError(res, 400, 'El documento solo puede contener letras y números');
        }
      }

      // Validar teléfono si está presente
      if (telefono) {
        const phoneRegex = /^\+[0-9]{7,15}$/;
        if (!phoneRegex.test(telefono)) {
          return ResponseMiddleware.sendError(res, 400, 'Formato de teléfono no válido. Debe comenzar con + y tener entre 7 y 15 dígitos');
        }
      }

      // Validar correo si está presente
      if (correo) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
          return ResponseMiddleware.sendError(res, 400, 'Formato de correo electrónico no válido');
        }
      }

      // Validar foto si está presente
      if (foto) {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(foto)) {
          return ResponseMiddleware.sendError(res, 400, 'La foto debe ser una URL válida que comience con http:// o https://');
        }
      }

      // Validar dirección si está presente
      if (direccion) {
        if (direccion.length > 1000) {
          return ResponseMiddleware.sendError(res, 400, 'La dirección no puede exceder los 1000 caracteres');
        }
      }

      // Validar contraseña si está presente (opcional)
      if (contrasena) {
        if (contrasena.length < 8 || contrasena.length > 100) {
          return ResponseMiddleware.sendError(res, 400, 'La contraseña debe tener entre 8 y 100 caracteres');
        }
        
        // Validar que la contraseña contenga al menos una mayúscula, una minúscula, un número y un carácter especial
        // Incluye caracteres especiales del español (á, é, í, ó, ú, ñ, Á, É, Í, Ó, Ú, Ñ)
        const passwordRegex = /^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[@$!%?&])[A-Za-zÁÉÍÓÚáéíóúÑñ\d@$!%?&]{8,}$/;
        if (!passwordRegex.test(contrasena)) {
          return ResponseMiddleware.sendError(res, 400, 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%?&)');
        }
      }

      next();
    } catch (error) {
      console.error('Error en validación de edición de perfil:', error);
      return ResponseMiddleware.sendError(res, 500, `Error en la validación de datos: ${error.message}`);
    }
  }
}

module.exports = UsersMiddleware;
