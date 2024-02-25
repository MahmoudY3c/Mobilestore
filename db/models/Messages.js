const { default: mongoose } = require('mongoose');
const { ROLESNAMES, ROLES } = require('../../config');
const { Schema } = mongoose;

const MessagesSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  receiver: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  senderRole: { type: String, default: ROLESNAMES.customer, enum: ROLES },
}, { timestamps: true });

const Messages = mongoose.models.Messages
  ? mongoose.model('Messages')
  : mongoose.model('Messages', MessagesSchema);


module.exports = Messages;
