
const { Router } = require('express');
const router = Router();
const { createRepairServices, createRepairServicesValidationSchema } = require('../../controllers/repairServices/createRepairServices.js');
const { deleteRepairServices } = require('../../controllers/repairServices/deleteRepairServices.js');
const { editRepairServices, editRepairServicesValidationSchema } = require('../../controllers/repairServices/editRepairServices.js');
const { sendRepairServices } = require('../../controllers/repairServices/sendRepairServices.js');
const { sendRepairServicesById } = require('../../controllers/repairServices/sendRepairServicesById.js');
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors.js');
const { validateParamId, validateQueryUserId } = require('../../middleware/validators/validateParams.js');
const checkRole = require('../../middleware/jwt/checkRole.js');

router.post(
  '/',
  checkRole('admin'),
  createRepairServicesValidationSchema,
  sendExpressValidatorErrors,
  createRepairServices,
);

router.delete(
  '/:id',
  checkRole('admin'),
  validateParamId,
  sendExpressValidatorErrors,
  deleteRepairServices,
);

router.put(
  '/:id',
  checkRole('admin'),
  validateParamId,
  editRepairServicesValidationSchema,
  sendExpressValidatorErrors,
  editRepairServices,
);

router.get(
  '/',
  validateQueryUserId,
  sendExpressValidatorErrors,
  sendRepairServices,
);

router.get(
  '/:id',
  validateParamId,
  sendExpressValidatorErrors,
  sendRepairServicesById,
);

module.exports = router;

