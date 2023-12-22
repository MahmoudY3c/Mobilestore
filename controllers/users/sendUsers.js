const Users = require('../../db/models/Users');
const { asyncHandler } = require('../../handlers/error');

const sendUsers = asyncHandler(async (req, res) => {
  const { role, skip = 0, limit = 14 } = req.query;
  console.log(req.query);
  const users = await Users.find({ role }, {}, { skip: Number(skip), limit: Number(limit) });
  const numberOfUsers = await Users.countDocuments({ role });
  res.status(200).json({ data: users, length: numberOfUsers });
});

module.exports = {
  sendUsers,
};

