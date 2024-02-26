const { asyncHandler, ErrorMessages } = require('../../handlers/error');
const { checkSchema } = require('express-validator');
const { extractRequiredFields } = require('../../handlers');
const RepairServices = require('../../db/models/RepairServices');
const { repairServicesPayload } = require('./createRepairServices');


const editRepairServicesPayload = repairServicesPayload(true);
delete editRepairServicesPayload.userId;
const editRepairServicesValidationSchema = checkSchema(editRepairServicesPayload);

const editRepairServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const RepairServicesData = extractRequiredFields(Object.keys(editRepairServicesPayload), req.body);

  if (!Object.keys(RepairServicesData).length) {
    return res.status(400).json({ error: { message: req.t('EMPTY_PAYLOAD') } });
  }

  // console.log(RepairServicesData);
  const _repairServices = await RepairServices.findByIdAndUpdate(id, RepairServicesData);

  if (!_repairServices) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, 'slider'));
  }

  res.status(200).json({ success: true });
});

module.exports = { editRepairServices, editRepairServicesValidationSchema };
