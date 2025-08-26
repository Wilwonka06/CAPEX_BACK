const express = require('express');
const UserRoleController = require('../controllers/UserRoleController');
const router = express.Router();

// Asignar un rol a un usuario
router.post('/asignar', UserRoleController.asignarRol);

// Remover un rol de un usuario
router.delete('/remover', UserRoleController.removerRol);

// Obtener todos los roles de un usuario
router.get('/usuario/:idUsuario/roles', UserRoleController.obtenerRolesDeUsuario);

// Obtener todos los usuarios de un rol
router.get('/rol/:idRol/usuarios', UserRoleController.obtenerUsuariosDeRol);

// Obtener todas las asignaciones activas
router.get('/asignaciones', UserRoleController.obtenerTodasLasAsignaciones);

// Verificar si un usuario tiene un rol específico
router.get('/usuario/:idUsuario/verificar', UserRoleController.verificarRol);

// Obtener usuarios con sus roles
router.get('/usuarios-con-roles', UserRoleController.obtenerUsuariosConRoles);

module.exports = router;
