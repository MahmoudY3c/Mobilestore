const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Products = require('../../db/models/Products');
const { productsPayload } = require('./createProduct');

const editProductPayload = productsPayload(true);

const editProductValidationSchema = checkSchema(editProductPayload, ['body']);

const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ProductData = extractRequiredFields(Object.keys(editProductPayload), req.body);
  const Product = await Products.findByIdAndUpdate(id, ProductData);
  if (!Product) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'Product' }) });
  }

  res.status(200).json({ success: true });
});

module.exports = { editProductValidationSchema, editProduct };

