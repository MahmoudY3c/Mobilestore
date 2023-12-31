const { asyncHandler } = require('../../handlers/error');
const RepairServices = require('../../db/models/RepairServices');

const sendRepairServices = asyncHandler(async (req, res) => {
  const { skip = 0, limit = 14 } = req.query;
  const _repairServices = await RepairServices.find({}, {}, { skip: Number(skip), limit: Number(limit) });
  const numberOfRepairServices = await RepairServices.countDocuments({});
  res.status(200).json({ data: _repairServices, length: numberOfRepairServices });
});

module.exports = { sendRepairServices };
