const { asyncHandler } = require('../../handlers/error');
const RepairServices = require('../../db/models/RepairServices');

const deleteRepairServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await RepairServices.deleteOne({ id });
  res.status(200).json({ success: true });
});

module.exports = { deleteRepairServices };

