
const { Router } = require('express');
const router = Router();
const { createRepairServices, createRepairServicesValidationSchema } = require('../../controllers/repairServices/createRepairServices.js');
const { deleteRepairServices } = require('../../controllers/repairServices/deleteRepairServices.js');
const { editRepairServices } = require('../../controllers/repairServices/editRepairServices.js');
const { sendRepairServices } = require('../../controllers/repairServices/sendRepairServices.js');
const { sendRepairServicesById } = require('../../controllers/repairServices/sendRepairServicesById.js');
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors.js');
const { validateParamId } = require('../../middleware/validators/validateParams.js');

router.post(
  '/',
  createRepairServicesValidationSchema,
  sendExpressValidatorErrors,
  createRepairServices,
);

router.delete(
  '/:id',
  validateParamId,
  sendExpressValidatorErrors,
  deleteRepairServices,
);

router.put(
  '/:id',
  validateParamId,
  sendExpressValidatorErrors,
  editRepairServices,
);

router.get(
  '/',
  sendRepairServices,
);

router.get(
  '/:id',
  validateParamId,
  sendExpressValidatorErrors,
  sendRepairServicesById,
);

module.exports = router;

