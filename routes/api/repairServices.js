
const { Router } = require('express');
const router = Router();
const { createRepairServices } = require('../../controllers/repairServices/createRepairServices.js');
const { deleteRepairServices } = require('../../controllers/repairServices/deleteRepairServices.js');
const { editRepairServices } = require('../../controllers/repairServices/editRepairServices.js');
const { sendRepairServices } = require('../../controllers/repairServices/sendRepairServices.js');
const { sendRepairServicesById } = require('../../controllers/repairServices/sendRepairServicesById.js');

router.post(
  '/',
  createRepairServices,
);

router.delete(
  '/',
  deleteRepairServices,
);

router.put(
  '/',
  editRepairServices,
);

router.get(
  '/',
  sendRepairServices,
);

router.get(
  '/:id',
  sendRepairServicesById,
);

module.exports = router;

