
const createHttpError = require('http-errors');
const Users = require('../../db/models/Users');
const { generateHashToken } = require('../../handlers/encryption');
const ResetToken = require('../../db/models/ResetToken');
const { sendMail } = require('../../handlers');

const resetPasswordController = async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (!user) return next(createHttpError(404));

  // create hash of the access token
  let { hash } = generateHashToken(email);
  hash = encodeURIComponent(hash);

  // save the access token for expartion handling
  const saveHash = new ResetToken({ userId: user._id, hash });
  await saveHash.save();

  // notify the user with the reset url
  const msg = await sendMail({
    email: 'zxcvpn011@gmail.com',
    subject: 'Reset Password',
    html: `
        <h2>
          use this url to reset your password
        </h2>
        <div>
          <a href="${req.protocol}://${req.get('host')}/api/reset-password/${hash}">${req.protocol}://${req.get('host')}/api/reset-password/${hash}</a>
        </div>
      `,
  });

  res.status(200).json({ message: msg });
};


module.exports = { resetPasswordController };

