
const { Router } = require('express');
const router = Router();
const { createCategory, createCategoryValidationSchema } = require('../../controllers/category/createCategory.js');
const { deleteCategory } = require('../../controllers/category/deleteCategory.js');
const { editCategory, editCategoryValidationSchema } = require('../../controllers/category/editCategory.js');
const { sendCategories } = require('../../controllers/category/sendCategories.js');
const { sendCategoryById } = require('../../controllers/category/sendCategoryById.js');
const { validateParamId } = require('../../middleware/validators/validateParams.js');
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors.js');
const { checkAuth } = require('../../middleware/jwt/checkAuth.js');

router.post(
  '/',
  checkAuth,
  createCategoryValidationSchema,
  sendExpressValidatorErrors,
  createCategory,
);

router.delete(
  '/:id',
  checkAuth,
  validateParamId,
  sendExpressValidatorErrors,
  deleteCategory,
);

router.put(
  '/:id',
  checkAuth,
  validateParamId,
  editCategoryValidationSchema,
  sendExpressValidatorErrors,
  editCategory,
);

router.get(
  '/',
  sendCategories,
);

router.get(
  '/:id',
  validateParamId,
  sendExpressValidatorErrors,
  sendCategoryById,
);

module.exports = router;

