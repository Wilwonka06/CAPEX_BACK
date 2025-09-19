const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');
const { Usuario } = require('../../models/User');
const { Role } = require('../../models/roles/Role');
const { sequelize } = require('../../config/database');

/**
 * Servicio de autenticación
 * Maneja el registro, login y gestión de tokens
 */
class AuthService {

  /**
   * Registrar un nuevo usuario como usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  static async registerUser(userData) {
    try {
      // Validar que el email no exista
      const existingUser = await Usuario.findOne({
        where: { correo: userData.correo }
      });

      if (existingUser) {
        throw new Error('El correo ya está registrado');
      }

      // Validar que el documento no exista
      const existingDocument = await Usuario.findOne({
        where: { 
          tipo_documento: userData.tipo_documento,
          documento: userData.documento
        }
      });

      if (existingDocument) {
        throw new Error('El documento ya está registrado');
      }

      // Buscar el rol de usuario (asumiendo que existe un rol con ID 1 para usuarios)
      let roleId = 1; // Rol de usuario por defecto
      
      try {
        const userRole = await Role.findOne({
          where: {
            nombre: 'Usuario',
            estado: true
          }
        });
        
        if (userRole) {
          roleId = userRole.id_rol;
        }
      } catch (error) {
        console.warn('No se pudo verificar el rol de usuario, usando rol por defecto:', error.message);
        roleId = 1;
      }

      // Encriptar la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.contrasena, saltRounds);

      // Crear el usuario
      const newUser = await Usuario.create({
        ...userData,
        contrasena: hashedPassword,
        roleId: roleId,
        estado: 'Activo'
        // concepto_estado es opcional
      });

      // Retornar usuario sin password
      const userData = newUser.toJSON();
      delete userData.contrasena;
      
      return userData;

    } catch (error) {
      // Si ya es un error personalizado, mantenerlo
      if (error.message.includes('ya está registrado')) {
        throw error;
      }
      
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  /**
   * Autenticar usuario (login)
   * @param {string} correo - Correo electrónico
   * @param {string} password - Contraseña sin encriptar
   * @returns {Promise<Object>} Token y datos del usuario
   */
  static async loginUser(correo, password) {
    try {
      // Buscar el usuario por correo
      const user = await Usuario.findOne({
        where: { correo: correo },
        include: [
          {
            model: Role,
            as: 'rol',
            attributes: ['id_rol', 'nombre', 'descripcion']
          }
        ]
      });

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.contrasena);
      
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          id_usuario: user.id_usuario,
          correo: user.correo,
          roleId: user.roleId,
          roleName: user.rol ? user.rol.nombre : 'Usuario'
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      // Retornar datos del usuario sin password
      const userData = user.toJSON();
      delete userData.contrasena;
      
      return {
        token,
        user: userData
      };

    } catch (error) {
      // Si ya es un error personalizado, mantenerlo
      if (error.message.includes('Credenciales inválidas')) {
        throw error;
      }
      
      throw new Error(`Error en la autenticación: ${error.message}`);
    }
  }

  /**
   * Verificar token JWT
   * @param {string} token - Token JWT
   * @returns {Promise<Object>} Datos decodificados del token
   */
  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      return decoded;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Obtener información del usuario actual
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  static async getCurrentUser(userId) {
    try {
      const user = await Usuario.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'rol',
            attributes: ['id_rol', 'nombre', 'descripcion']
          }
        ]
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Retornar usuario sin password
      const userData = user.toJSON();
      delete userData.contrasena;
      
      return userData;

    } catch (error) {
      throw new Error(`Error al obtener información del usuario: ${error.message}`);
    }
  }

  /**
   * Editar perfil del usuario logueado
   * @param {number} userId - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  static async editProfile(userId, updateData) {
    try {
      // Verificar que el usuario existe
      const user = await Usuario.findByPk(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Preparar datos para actualización
      const updateFields = {};

      // Validar y agregar campos si están presentes
      if (updateData.nombre !== undefined) {
        updateFields.nombre = updateData.nombre;
      }

      if (updateData.tipo_documento !== undefined) {
        updateFields.tipo_documento = updateData.tipo_documento;
      }

      if (updateData.documento !== undefined) {
        // Verificar que el documento no esté en uso por otro usuario
        const existingDocument = await Usuario.findOne({
          where: { 
            documento: updateData.documento,
            id_usuario: { [sequelize.Op.ne]: userId } // Excluir el usuario actual
          }
        });

        if (existingDocument) {
          throw new Error('El documento ya está registrado por otro usuario');
        }
        updateFields.documento = updateData.documento;
      }

      if (updateData.telefono !== undefined) {
        updateFields.telefono = updateData.telefono;
      }

      if (updateData.correo !== undefined) {
        // Verificar que el correo no esté en uso por otro usuario
        const existingEmail = await Usuario.findOne({
          where: { 
            correo: updateData.correo,
            id_usuario: { [sequelize.Op.ne]: userId } // Excluir el usuario actual
          }
        });

        if (existingEmail) {
          throw new Error('El correo ya está registrado por otro usuario');
        }
        updateFields.correo = updateData.correo;
      }

      if (updateData.contrasena !== undefined) {
        // Encriptar la nueva contraseña
        const saltRounds = 10;
        updateFields.contrasena = await bcrypt.hash(updateData.contrasena, saltRounds);
      }

      if (updateData.foto !== undefined) {
        updateFields.foto = updateData.foto;
      }

      if (updateData.direccion !== undefined) {
        updateFields.direccion = updateData.direccion;
      }

      if (updateData.estado !== undefined) {
        updateFields.estado = updateData.estado;
      }

      if (updateData.concepto_estado !== undefined) {
        updateFields.concepto_estado = updateData.concepto_estado;
      }

      // Actualizar el usuario
      await Usuario.update(updateFields, {
        where: { id_usuario: userId }
      });

      // Obtener el usuario actualizado con información del rol
      const updatedUser = await Usuario.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'rol',
            attributes: ['id_rol', 'nombre', 'descripcion']
          }
        ]
      });

      // Retornar usuario sin password
      const userData = updatedUser.toJSON();
      delete userData.contrasena;
      
      return userData;

    } catch (error) {
      // Si ya es un error personalizado, mantenerlo
      if (error.message.includes('ya está registrado') || error.message.includes('no encontrado')) {
        throw error;
      }
      
      throw new Error(`Error al actualizar perfil: ${error.message}`);
    }
  }
}

module.exports = AuthService;
