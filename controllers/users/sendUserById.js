const Users = require('../../db/models/Users');
const { asyncHandler, ErrorMessages } = require('../../handlers/error');


const sendUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Users.findOne({ _id: id });
  if (!user) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, 'user'));
  }

  res.status(200).json(user);
});

module.exports = {
  sendUserById,
};

