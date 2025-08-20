// src/middlewares/SchedulingMiddleware.js

const { body, query } = require('express-validator');
const ValidationMiddleware = require('./ValidationMiddleware');

/**
 * Middleware para validar datos de creación/actualización de Scheduling individual
 * Verifica que los campos obligatorios estén presentes y tengan formato válido
 */
const validateSchedulingData = (req, res, next) => {
  const { fecha_inicio, hora_entrada, hora_salida, id_empleado } = req.body;

  // Validar campos obligatorios
  if (!fecha_inicio || !hora_entrada || !hora_salida || !id_empleado) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos obligatorios: fecha_inicio, hora_entrada, hora_salida e id_empleado son requeridos.',
    });
  }

  // Validar formato de fecha (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(fecha_inicio)) {
    return res.status(400).json({
      success: false,
      message: 'La fecha debe tener el formato YYYY-MM-DD.',
    });
  }

  // Validar que la fecha no sea anterior a hoy
  const today = new Date().toISOString().split('T')[0];
  if (fecha_inicio < today) {
    return res.status(400).json({
      success: false,
      message: 'La fecha no puede ser anterior a hoy.',
    });
  }

  // Validar formato de hora (HH:MM:SS o HH:MM)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
  if (!timeRegex.test(hora_entrada) || !timeRegex.test(hora_salida)) {
    return res.status(400).json({
      success: false,
      message: 'Las horas deben tener el formato HH:MM o HH:MM:SS (00:00 a 23:59).',
    });
  }

  // Validar que la hora de salida sea posterior a la de entrada
  if (hora_salida <= hora_entrada) {
    return res.status(400).json({
      success: false,
      message: 'La hora de salida debe ser posterior a la hora de entrada.',
    });
  }

  // Validación de empleado removida para pruebas
  // Solo verificar que sea un número
  if (isNaN(Number(id_empleado))) {
    return res.status(400).json({
      success: false,
      message: 'El ID del empleado debe ser un número.',
    });
  }

  next();
};

/**
 * Middleware para validar datos de creación de múltiples programaciones
 */
const validateMultipleSchedulingData = (req, res, next) => {
  const { startDate, endDate, selectedDays, startTime, endTime, employeeId } = req.body;

  // Validar campos obligatorios
  if (!startDate || !endDate || !selectedDays || !startTime || !endTime || !employeeId) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos obligatorios: startDate, endDate, selectedDays, startTime, endTime y employeeId son requeridos.',
    });
  }

  // Validar formato de fechas
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return res.status(400).json({
      success: false,
      message: 'Las fechas deben tener el formato YYYY-MM-DD.',
    });
  }

  // Validar que la fecha de inicio no sea posterior a la de fin
  if (startDate > endDate) {
    return res.status(400).json({
      success: false,
      message: 'La fecha de inicio no puede ser posterior a la fecha de fin.',
    });
  }

  // Validar que la fecha de inicio no sea anterior a hoy
  const today = new Date().toISOString().split('T')[0];
  if (startDate < today) {
    return res.status(400).json({
      success: false,
      message: 'La fecha de inicio no puede ser anterior a hoy.',
    });
  }

  // Validar formato de horas
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return res.status(400).json({
      success: false,
      message: 'Las horas deben tener el formato HH:MM o HH:MM:SS (00:00 a 23:59).',
    });
  }

  // Validar que la hora de salida sea posterior a la de entrada
  if (endTime <= startTime) {
    return res.status(400).json({
      success: false,
      message: 'La hora de salida debe ser posterior a la hora de entrada.',
    });
  }

  // Validar días seleccionados
  if (!Array.isArray(selectedDays) || selectedDays.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'selectedDays debe ser un array no vacío con los días de la semana (0=Dom, 6=Sáb).',
    });
  }

  // Validar que los días estén en el rango correcto
  const validDays = [0, 1, 2, 3, 4, 5, 6];
  if (!selectedDays.every(day => validDays.includes(day))) {
    return res.status(400).json({
      success: false,
      message: 'Los días deben ser números del 0 al 6 (0=Dom, 6=Sáb).',
    });
  }

  // Validación de empleado removida para pruebas
  // Solo verificar que sea un número
  if (isNaN(Number(employeeId))) {
    return res.status(400).json({
      success: false,
      message: 'El ID del empleado debe ser un número.',
    });
  }

  next();
};

module.exports = {
  validateSchedulingData,
  validateMultipleSchedulingData,
};
