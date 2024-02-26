
const { asyncHandler } = require('../../handlers/error');
const { ROLESNAMES, ROLES } = require('../../config');
const Users = require('../../db/models/Users');
const { checkSchema } = require('express-validator');

const sendMessagesUsersValidationSchema = checkSchema({
  id: {
    trim: true,
    isMongoId: true,
    errorMessage: (value, { req }) => req.t('INVALID_ID', { id: value }),
  },
  role: {
    optional: true,
    trim: true,
    isIn: {
      options: [ROLES],
      errorMessage: (value, { req }) => req.t('INVALID_ROLE', { value }),
    },
  },
}, ['query']);

const sendMessagesUsers = asyncHandler(async (req, res) => {
  const { skip = 0, limit = 14, id: userId, role: requiredUsersRole } = req.query;
  const { _id: sender, role } = req.payload;
  // that var is used to handle sending all receiver messages when the senderRole is admin
  const senderRole = role === ROLESNAMES.admin ? ROLESNAMES.customer : ROLESNAMES.admin;
  const query = { senderRole };
  // select by sender id when senderRole is customer else select by receiver id when sender role is admin
  if (role === ROLESNAMES.customer) {
    query.sender = sender;
  } else if (role === ROLESNAMES.admin) {
    query.receiver = userId;
  }

  const aggregation = [
    {
      $match: {
        role: requiredUsersRole || { $in: ROLES },
      },
    },
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'receiver',
        as: 'messages',
      },
    },
    // {
    //   $unwind: '$messages',
    // },
    {
      $project: {
        userName: 1,
        phoneNumber: 1,
        role: 1,
        _id: 1,
        // unSeenMessages: {
        //   $sum: {
        //     $cond: [
        //       { $and: [{ $eq: ['$messages.receiver', '$_id'] }, { $eq: ['$messages.seen', false] }] }, // Check receiver ID and unread status
        //       1,
        //       0,
        //     ],
        //   },
        // },
        // latestMessageTimestamp: {
        //   $max: '$messages.createdAt',
        // },
      },
    },
    // {
    //   $sort: {
    //     latestMessageTimestamp: -1, // Sort by latest message timestamp (descending)
    //   },
    // },
    {
      $skip: Number(skip),
    },
    {
      $limit: Number(limit), // Replace with desired limit value
    },
  ];

  // const msgs = await Messages.find(query, {}, { skip: Number(skip), limit: Number(limit) });
  // handling find users and sort by latest sent message + also send the number of unseen messages
  const usersData = await Users.aggregate(aggregation);
  console.log(usersData);
  const numberOfUsers = await Users.countDocuments(aggregation);
  res.status(200).json({ data: usersData, length: numberOfUsers });
});

module.exports = {
  sendMessagesUsers,
  sendMessagesUsersValidationSchema,
};


/**
 *
 *
const sendMessagesUsers = asyncHandler(async (req, res) => {
  const { skip = 0, limit = 14, id: userId, role: requiredUsersRole } = req.query;
  const { _id: sender, role } = req.payload;
  // that var is used to handle sending all receiver messages when the senderRole is admin
  const senderRole = role === ROLESNAMES.admin ? ROLESNAMES.customer : ROLESNAMES.admin;
  const query = { senderRole };
  // select by sender id when senderRole is customer else select by receiver id when sender role is admin
  if (role === ROLESNAMES.customer) {
    query.sender = sender;
  } else if (role === ROLESNAMES.admin) {
    query.receiver = userId;
  }

  const aggregation = [
    {
      $match: {
        role: requiredUsersRole || { $in: ROLES },
      },
    },
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'receiver',
        as: 'messages',
      },
    },
    // {
    //   $unwind: '$messages',
    // },
    {
      $project: {
        userName: 1,
        phoneNumber: 1,
        role: 1,
        _id: 1,
        // unSeenMessages: {
        //   $sum: {
        //     $cond: [
        //       { $and: [{ $eq: ['$messages.receiver', '$_id'] }, { $eq: ['$messages.seen', false] }] }, // Check receiver ID and unread status
        //       1,
        //       0,
        //     ],
        //   },
        // },
        // latestMessageTimestamp: {
        //   $max: '$messages.createdAt',
        // },
      },
    },
    // {
    //   $sort: {
    //     latestMessageTimestamp: -1, // Sort by latest message timestamp (descending)
    //   },
    // },
    {
      $skip: Number(skip),
    },
    {
      $limit: Number(limit), // Replace with desired limit value
    },
  ];

  // const msgs = await Messages.find(query, {}, { skip: Number(skip), limit: Number(limit) });
  // handling find users and sort by latest sent message + also send the number of unseen messages
  const usersData = await Users.aggregate(aggregation);
  console.log(usersData);
  const numberOfUsers = await Users.countDocuments(aggregation);
  res.status(200).json({ data: usersData, length: numberOfUsers });
});
 */
