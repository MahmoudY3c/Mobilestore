const RepairServices = require('../../db/models/RepairServices');
const { asyncHandler } = require('../../handlers/error');

const sendRepairServicesById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const _repairServices = await RepairServices.findOne({ _id: id });

  if (!_repairServices) {
    throw new Error(req.t('NOT_FOUND', { field: 'RepairServices' }));
  }

  res.status(200).json(_repairServices);
});

module.exports = { sendRepairServicesById };
