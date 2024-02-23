const Users = require('../../db/models/Users');
const { asyncHandler } = require('../../handlers/error');

const sendUsers = asyncHandler(async (req, res) => {
  const { role, q, skip = 0, limit = 14 } = req.query;
  if (q) {
    const query = { q };
    // handling search
    const search = {
      $or: [
        { userName: { $regex: new RegExp(query, 'gi') } },
        { phoneNumber: { $regex: new RegExp(query, 'gi') } },
      ],
    };

    const foundUsers = await Users.find(search, {}, { skip: Number(skip), limit: Number(limit) });
    const numberOfProducts = await Users.countDocuments(search);
    return res.status(200).json({ data: foundUsers, length: numberOfProducts });
  }

  // console.log(req.query);
  const users = await Users.find({ role }, {}, { skip: Number(skip), limit: Number(limit) });
  const numberOfUsers = await Users.countDocuments({ role });
  res.status(200).json({ data: users, length: numberOfUsers });
});

module.exports = {
  sendUsers,
};

