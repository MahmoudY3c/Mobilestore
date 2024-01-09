
const jwt = require('jsonwebtoken');
const { RSASECRET, TokensConfig } = require('../../config');
const UsersTokens = require('../../db/models/UsersTokens');

// generate token and encrypt by RSASECRET key
const signToken = (payload, expiresIn = TokensConfig.expairs, Bearer) => `${Bearer || ''}${jwt.sign(payload, RSASECRET, { algorithm: 'RS256', expiresIn })}`;

const updateToken = async (user, token, refreshToken) => {
  // remove Breaer\s
  token = token.split(' ')[1];

  const data = {
    userId: user._id, token,
  };

  if (refreshToken) {
    refreshToken = refreshToken.split(' ')[1];
    data.refresh = refreshToken;
  }

  // check if the user already has a refresh token and update it
  const UserToken = await UsersTokens.findOne({ userId: user._id });
  // remove this line and handle it in another way if you want to allow the user to login from different devices at the same time
  if (UserToken) await UsersTokens.deleteMany({ userId: user._id });

  await new UsersTokens(data).save();
};

module.exports = {
  signToken,
  updateToken,
};

