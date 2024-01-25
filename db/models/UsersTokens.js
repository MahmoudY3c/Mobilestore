const { default: mongoose } = require('mongoose');
const { TokensConfig } = require('../../config');
const { Schema } = mongoose;

const UsersTokensSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  token: { type: String, required: true },
  refresh: { type: String },
  payload: { type: Object },
  createdAt: { type: Date, default: Date.now, expires: TokensConfig.refreshMs },
}, { timestamps: true });

const UsersTokens = mongoose.models.UsersTokens
  ? mongoose.model('UsersTokens')
  : mongoose.model('UsersTokens', UsersTokensSchema);


module.exports = UsersTokens;


// update ttl expiration date run it by cmd in mongocompass or cmd mongosh
/*
db.runCommand({
  "collMod": "UsersTokenss",
  "index": {
    "keyPattern": {"createdAt": 1},
    "expireAfterSeconds": 60
  }
})
*/

