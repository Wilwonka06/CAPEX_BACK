const express = require("express");
const router = express.Router();
const ServicesController = require("../controllers/ServicesController");
const {
  validateServiceData,
  validateServiceUpdate,
} = require("../middlewares/ServicesMiddleware");

router.post("/", validateServiceData, ServicesController.create);
router.get("/", ServicesController.getAll);
router.get("/:id", ServicesController.getById);
router.put("/:id", validateServiceUpdate, ServicesController.update);
router.delete("/:id", ServicesController.delete);

module.exports = router;
