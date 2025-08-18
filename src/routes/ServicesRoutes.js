// routes/servicioRoutes.js
const express = require("express");
const router = express.Router();
const servicioController = require("../controllers/servicioController");
const validarServicio = require("../middlewares/validarServicio");

router.post("/", validarServicio, servicioController.create);
router.get("/", servicioController.getAll);
router.get("/:id", servicioController.getById);
router.put("/:id", validarServicio, servicioController.update);
router.delete("/:id", servicioController.delete);

module.exports = router;
