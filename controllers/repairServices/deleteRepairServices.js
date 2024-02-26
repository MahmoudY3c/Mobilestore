const { asyncHandler, ErrorMessages } = require('../../handlers/error');
const RepairServices = require('../../db/models/RepairServices');
const Users = require('../../db/models/Users');

const deleteRepairServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const repairServ = await RepairServices.findByIdAndDelete(id);

  if (!repairServ) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, id));
  }

  await Users.findByIdAndUpdate(repairServ.userId.toString(), {
    $pull: {
      services: repairServ._id.toString(),
    },
  }, { safe: true, upsert: true });

  res.status(200).json({ success: true });
});

module.exports = { deleteRepairServices };

