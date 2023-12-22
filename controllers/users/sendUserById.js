const Users = require('../../db/models/Users');
const { asyncHandler } = require('../../handlers/error');


const sendUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Users.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'user' }) });
  }

  res.status(200).json(user);
});

module.exports = {
  sendUserById,
};

