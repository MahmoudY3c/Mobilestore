const mongoose = require('mongoose');
const { ROLES } = require('../../config');
const { verifyPassword, hashPassword } = require('../../handlers/encryption');
const { autoPopulate } = require('../../handlers/mdb');
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
  services: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'CustomerServices',
    },
  ],
}, { timestamps: true });

UsersSchema.statics.findByCredentials = async ({ email, id, password, req }) => {
  const user = id
    ? await Users.findById(id)
    : await Users.findOne({ email });

  if (!user) {
    throw new Error(req ? req.t('USER_NOT_EXISTS') : 'user don\'t exist');
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw new Error(req ? req.t('WRONG_PASSWORD') : 'wrong Password');
  }

  return user;
};

UsersSchema
  .pre('findOne', autoPopulate('services'))
  .pre('find', autoPopulate('services'));

UsersSchema.pre('save', async function (next) {
  // this is refering to the user object
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }

  next();
});

UsersSchema.methods.toJSON = function () {
  const { userName, phoneNumber, role, _id, services } = this.toObject();
  return { userName, phoneNumber, role, _id, services };
};

const Users = mongoose.models.Users
  ? mongoose.model('Users')
  : mongoose.model(
    'Users',
    UsersSchema,
  );

module.exports = Users;

