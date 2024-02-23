const Users = require('../../db/models/Users');
const { asyncHandler } = require('../../handlers/error');

const findUser = asyncHandler(async (req, res) => {
  const { q, skip = 0, limit = 14 } = req.query;
  const query = { q };
  // handling search
  const search = {
    $or: [
      { userName: { $regex: new RegExp(query, 'gi') } },
      { phoneNumber: { $regex: new RegExp(query, 'gi') } },
    ],
  };

  const users = await Users.find(search, {}, { skip: Number(skip), limit: Number(limit) });
  const numberOfProducts = await Users.countDocuments(search);
  return res.status(200).json({ data: users, length: numberOfProducts });
});

module.exports = { findUser };

