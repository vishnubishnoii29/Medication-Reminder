const express = require('express');
const medicineController = require('../../controllers/medicineController');
const authController = require('../../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(medicineController.getAllMedicines)
  .post(medicineController.createMedicine);

router
  .route('/:id')
  .get(medicineController.getMedicine)
  .put(medicineController.updateMedicine)
  .delete(medicineController.deleteMedicine);

module.exports = router;
