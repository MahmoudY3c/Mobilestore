const { milliseconds } = require('../../handlers/time');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResetTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: milliseconds.minutes(60) }, // expair after 60 minutes
});

const ResetToken = mongoose.model('ResetToken', ResetTokenSchema);

module.exports = ResetToken;
