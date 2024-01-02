const { asyncHandler } = require('../../handlers/error');
const RepairServices = require('../../db/models/RepairServices');

const deleteRepairServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const repairServ = await RepairServices.findByIdAndDelete({ id });

  if (!repairServ) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: id }) });
  }

  res.status(200).json({ success: true });
});

module.exports = { deleteRepairServices };

