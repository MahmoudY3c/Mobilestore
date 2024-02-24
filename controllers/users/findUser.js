const Users = require('../../db/models/Users');
const { asyncHandler } = require('../../handlers/error');

// a query search middleware to get users route
const findUser = asyncHandler(async (req, res, next) => {
  const { q, skip = 0, limit = 14 } = req.query;
  if (q) {
    // handling search
    const search = {
      $or: [
        {
          userName: {
            $regex: new RegExp(q, 'gi'),
          },
        },
        {
          phoneNumber: {
            $regex: new RegExp(q, 'gi'),
          },
        },
      ],
    };

    const users = await Users.find(search, {}, { skip: Number(skip), limit: Number(limit) });
    const numberOfUsers = await Users.countDocuments(search);
    return res.status(200).json({ data: users, length: numberOfUsers });
  }

  next();
});

module.exports = { findUser };

