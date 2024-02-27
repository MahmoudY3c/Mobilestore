
const { asyncHandler } = require('../../handlers/error');
const { ROLESNAMES, ROLES } = require('../../config');
const Users = require('../../db/models/Users');

const sendMessagesUsers = asyncHandler(async (req, res) => {
  const { skip = 0, limit = 14/* , id: userId, role: requiredUsersRole */ } = req.query;
  const { _id, role } = req.payload;
  // search for all users roles when role is admin else customer search for admin users only
  const requestedUsersRole = role === ROLESNAMES.admin ? { $in: ROLES } : ROLESNAMES.admin;

  const aggregation = [
    // Match only where the user is in requested role + exclude the user sent the request
    { $match: { role: requestedUsersRole, _id: { $ne: _id } } },

    // Lookup messages, 'from' will be localField (user._id) and 'as' will be the output array field
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'receiver', // Assumes messages were sent to admins
        as: 'messages',
        // select where role != user role
        pipeline: [
          // { $match: { senderRole: { $ne: role } } }, // Filter by senderRole in messages
          { $project: { message: 1, seen: 1, createdAt: 1 } }, // Project only required message fields
          { $sort: { createdAt: -1 } },
        ],
      },
    },

    // Unwind the messages array (to work with individual messages).
    { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },

    // Group by user, carry forward the necessary fields
    {
      $group: {
        _id: '$_id',
        userName: { $first: '$userName' },
        phoneNumber: { $first: '$phoneNumber' },
        role: { $first: '$role' },
        message: { $last: '$messages.message' },
        timestamp: { $max: '$messages.createdAt' },
        createdAt: { $max: '$createdAt' },
        unseen: {
          $sum: { $cond: [{ $eq: ['$messages.seen', false] }, 1, 0] },
        },
      },
    },

    // sort by createdAt, timestamp to make the users sent messages at the top and use createdAt to make the users sortation is stable by making the users creation date at the top after timestamp
    { $sort: { timestamp: -1, createdAt: -1 } },

    {
      $skip: Number(skip),
    },
    {
      $limit: Number(limit), // Replace with desired limit value
    },
  ];

  const usersData = await Users.aggregate(aggregation);
  const numberOfUsers = await Users.countDocuments({});
  res.status(200).json({ data: usersData, length: numberOfUsers });
});

module.exports = {
  sendMessagesUsers,
};

