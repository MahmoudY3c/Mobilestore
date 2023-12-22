const mongoose = require('mongoose');
const { ROLES, SERVICE } = require('../../config');
const { verifyPassword, hashPassword } = require('../../handlers/encryption');
const { Schema } = mongoose;

const UsersSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ROLES,
  },
  phoneType: {
    type: String,
  },
  serviceType: {
    type: String,
  },
  serviceStatus: {
    type: String,
    enum: SERVICE.type,
  },
  warantiDuration: {
    type: String,
  },
}, { timestamps: true });


UsersSchema.statics.findByCredentials = async ({ email, id, password }) => {
  const user = id
    ? await Users.findById(id)
    : await Users.findOne({ email });

  if (!user) {
    throw new Error('user don\'t exist');
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw new Error('wrong Password');
  }

  return user;
};

UsersSchema.pre('save', async function (next) {
  // this is refering to the user object
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }

  next();
});

UsersSchema.methods.toJSON = function () {
  const { userName, phoneNumber, role, _id, phoneType, serviceType, serviceStatus, warantiDuration } = this.toObject();
  return { userName, phoneNumber, role, _id, phoneType, serviceType, serviceStatus, warantiDuration };
};

const Users = mongoose.models.Users
  ? mongoose.model('Users')
  : mongoose.model(
    'Users',
    UsersSchema,
  );

module.exports = Users;

