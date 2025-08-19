// src/middlewares/EmployeeMiddleware.js

/**
 * Middleware para validar datos de creación/actualización de empleados
 */
const validateEmployeeData = (req, res, next) => {
  const { nombre, tipo_documento, documento, telefono, correo, contrasena, estado } = req.body;

  // Validar campos obligatorios para creación
  if (!nombre || !tipo_documento || !documento || !telefono || !correo || !contrasena) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos obligatorios: nombre, tipo_documento, documento, telefono, correo y contrasena son requeridos.',
    });
  }

  // Validar formato del nombre (solo letras y espacios)
  const nameRegex = /^[A-Za-zÁÉÍÓúáéíóúÑñ ]+$/;
  if (!nameRegex.test(nombre)) {
    return res.status(400).json({
      success: false,
      message: 'El nombre solo puede contener letras y espacios.',
    });
  }

  // Validar tipo de documento
  const validDocumentTypes = ['Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'];
  if (!validDocumentTypes.includes(tipo_documento)) {
    return res.status(400).json({
      success: false,
      message: 'Tipo de documento inválido. Debe ser: Pasaporte, Cedula de ciudadania o Cedula de extranjeria.',
    });
  }

  // Validar formato del documento (solo alfanumérico)
  const documentRegex = /^[A-Za-z0-9]+$/;
  if (!documentRegex.test(documento)) {
    return res.status(400).json({
      success: false,
      message: 'El documento solo puede contener letras y números.',
    });
  }

  // Validar formato del teléfono (+ seguido de 7-15 dígitos)
  const phoneRegex = /^\+[0-9]{7,15}$/;
  if (!phoneRegex.test(telefono)) {
    return res.status(400).json({
      success: false,
      message: 'El teléfono debe tener el formato + seguido de 7 a 15 dígitos.',
    });
  }

  // Validar formato del correo
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({
      success: false,
      message: 'El correo debe tener un formato válido.',
    });
  }

  // Validar contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
  if (!passwordRegex.test(contrasena)) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%?&).',
    });
  }

  // Validar estado si se proporciona
  if (estado) {
    const validStates = ['Activo', 'Inactivo', 'Suspendido', 'Enfermo', 'Incapacitado', 'Luto', 'Fallecido'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser uno de: Activo, Inactivo, Suspendido, Enfermo, Incapacitado, Luto, Fallecido.',
      });
    }
  }

  next();
};

/**
 * Middleware para validar datos de actualización de empleados (campos opcionales)
 */
const validateEmployeeUpdate = (req, res, next) => {
  const { nombre, tipo_documento, documento, telefono, correo, contrasena, estado } = req.body;

  // Si se proporciona nombre, validar formato
  if (nombre) {
    const nameRegex = /^[A-Za-zÁÉÍÓúáéíóúÑñ ]+$/;
    if (!nameRegex.test(nombre)) {
      return res.status(400).json({
        success: false,
        message: 'El nombre solo puede contener letras y espacios.',
      });
    }
  }

  // Si se proporciona tipo de documento, validar
  if (tipo_documento) {
    const validDocumentTypes = ['Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'];
    if (!validDocumentTypes.includes(tipo_documento)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de documento inválido. Debe ser: Pasaporte, Cedula de ciudadania o Cedula de extranjeria.',
      });
    }
  }

  // Si se proporciona documento, validar formato
  if (documento) {
    const documentRegex = /^[A-Za-z0-9]+$/;
    if (!documentRegex.test(documento)) {
      return res.status(400).json({
        success: false,
        message: 'El documento solo puede contener letras y números.',
      });
    }
  }

  // Si se proporciona teléfono, validar formato
  if (telefono) {
    const phoneRegex = /^\+[0-9]{7,15}$/;
    if (!phoneRegex.test(telefono)) {
      return res.status(400).json({
        success: false,
        message: 'El teléfono debe tener el formato + seguido de 7 a 15 dígitos.',
      });
    }
  }

  // Si se proporciona correo, validar formato
  if (correo) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        success: false,
        message: 'El correo debe tener un formato válido.',
      });
    }
  }

  // Si se proporciona contraseña, validar formato
  if (contrasena) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%?&).',
      });
    }
  }

  // Si se proporciona estado, validar
  if (estado) {
    const validStates = ['Activo', 'Inactivo', 'Suspendido', 'Enfermo', 'Incapacitado', 'Luto', 'Fallecido'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser uno de: Activo, Inactivo, Suspendido, Enfermo, Incapacitado, Luto, Fallecido.',
      });
    }
  }

  next();
};

module.exports = {
  validateEmployeeData,
  validateEmployeeUpdate,
};
