const express = require('express');
const { sendUsers } = require('../../controllers/users/sendUsers');
const { createUser, createUserValidationSchema } = require('../../controllers/users/createUser');
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors');
const { sendUserById } = require('../../controllers/users/sendUserById');
const { editUserValidationSchema, editUser } = require('../../controllers/users/editUser');
const { validateParamId } = require('../../middleware/validators/validateParams');
const { deleteUser } = require('../../controllers/users/deleteUser');
// const checkRole = require('../../middleware/jwt/checkRole');
const router = express.Router();

/* GET users listing. */
router.get('/',
  // checkRole('admin'),
  sendUsers,
);

router.get('/:id',
  // checkRole('admin'),
  validateParamId,
  sendExpressValidatorErrors,
  sendUserById,
);

router.put('/:id',
  // checkRole('admin'),
  validateParamId,
  editUserValidationSchema,
  sendExpressValidatorErrors,
  editUser,
);


router.delete('/:id',
  // checkRole('admin'),
  validateParamId,
  sendExpressValidatorErrors,
  deleteUser,
);

router.post('/',
  // checkRole('admin'),
  createUserValidationSchema,
  sendExpressValidatorErrors,
  createUser,
);

module.exports = router;
