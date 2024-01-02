
const { Router } = require('express');
const router = Router();
const { createProduct } = require('../../controllers/products/createProduct.js');
const { deleteProduct } = require('../../controllers/products/deleteProduct.js');
const { editProduct } = require('../../controllers/products/editProduct.js');
const { sendProductById } = require('../../controllers/products/sendProductById.js');
const { sendProducts } = require('../../controllers/products/sendProducts.js');

router.post(
  '/',
  createProduct,
);

router.delete(
  '/',
  deleteProduct,
);

router.put(
  '/',
  editProduct,
);

router.get(
  '/:id',
  sendProductById,
);

router.get(
  '/',
  sendProducts,
);


module.exports = router;

