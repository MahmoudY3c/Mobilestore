
const { Router } = require('express');
const router = Router();
const { createProduct, createProductValidationSchema, productUpload } = require('../../controllers/products/createProduct.js');
const { deleteProduct } = require('../../controllers/products/deleteProduct.js');
const { editProduct, editProductValidationSchema } = require('../../controllers/products/editProduct.js');
const { sendProductById } = require('../../controllers/products/sendProductById.js');
const { sendProducts } = require('../../controllers/products/sendProducts.js');
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors.js');
const { validateParamId } = require('../../middleware/validators/validateParams.js');
const uploadFilesToCloudinary = require('../../middleware/uploadFilesToCloudinary.js');
const { checkAuth } = require('../../middleware/jwt/checkAuth.js');
const checkRole = require('../../middleware/jwt/checkRole.js');

router.post(
  '/',
  checkAuth,
  checkRole('admin'),
  productUpload,
  createProductValidationSchema,
  sendExpressValidatorErrors,
  uploadFilesToCloudinary(),
  createProduct,
);

router.delete(
  '/:id',
  checkAuth,
  checkRole('admin'),
  validateParamId,
  sendExpressValidatorErrors,
  deleteProduct,
);

router.put(
  '/:id',
  checkAuth,
  checkRole('admin'),
  productUpload,
  validateParamId,
  editProductValidationSchema,
  sendExpressValidatorErrors,
  uploadFilesToCloudinary(),
  editProduct,
);

router.get(
  '/:id',
  validateParamId,
  sendExpressValidatorErrors,
  sendProductById,
);

router.get(
  '/',
  sendProducts,
);


module.exports = router;

