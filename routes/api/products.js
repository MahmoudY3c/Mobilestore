
const { Router } = require('express');
const router = Router();
const { createProduct, createProductValidationSchema, productUpload } = require('../../controllers/products/createProduct.js');
const { deleteProduct } = require('../../controllers/products/deleteProduct.js');
const { editProduct } = require('../../controllers/products/editProduct.js');
const { sendProductById } = require('../../controllers/products/sendProductById.js');
const { sendProducts } = require('../../controllers/products/sendProducts.js');
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors.js');
const { validateParamId } = require('../../middleware/validators/validateParams.js');
const uploadFilesToCloudinary = require('../../middleware/uploadFilesToCloudinary.js');

router.post(
  '/',
  productUpload,
  createProductValidationSchema,
  sendExpressValidatorErrors,
  uploadFilesToCloudinary(),
  createProduct,
);

router.delete(
  '/:id',
  validateParamId,
  sendExpressValidatorErrors,
  deleteProduct,
);

router.put(
  '/:id',
  validateParamId,
  sendExpressValidatorErrors,
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

