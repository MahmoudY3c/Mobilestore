const { asyncHandler } = require('../../handlers/error');
const Users = require('../../db/models/Users');

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Users.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: id }) });
  }

  res.status(200).json({ success: true });
});

module.exports = { deleteUser };

