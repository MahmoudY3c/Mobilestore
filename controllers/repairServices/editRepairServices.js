const { asyncHandler } = require('../../handlers/error');
const { checkSchema } = require('express-validator');
const { extractRequiredFields } = require('../../handlers');
const RepairServices = require('../../db/models/RepairServices');
const { repairServicesPayload } = require('./createRepairServices');


const editRepairServicesPayload = repairServicesPayload(true);
const editRepairServicesValidationSchema = checkSchema(editRepairServicesPayload);

const editRepairServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const RepairServicesData = extractRequiredFields(Object.keys(editRepairServicesPayload), req.body);

  if (!Object.keys(RepairServicesData).length) {
    return res.status(400).json({ error: req.t('EMPTY_PAYLOAD') });
  }

  // console.log(RepairServicesData);
  const _repairServices = await RepairServices.findByIdAndUpdate(id, RepairServicesData);

  if (!_repairServices) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'slider' }) });
  }

  res.status(200).json({ success: true });
});

module.exports = { editRepairServices, editRepairServicesValidationSchema };