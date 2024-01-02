const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Products = require('../../db/models/Products');

const productsPayload = isOptional => ({
  name: {
    trim: true,
    notEmpty: true,
    errorMessage: (value, { req }) => req.t('INVALID_PRODUCT_NAME', { value }),
  },
  description: {
    trim: true,
    escape: true,
    notEmpty: true,
    optional: Boolean(isOptional),
    errorMessage: (value, { req }) => req.t('INVALID_PRODUCT_DESCRIPTION', { value }),
  },
  // images: {
  //   notEmpty: true,
  //   optional: Boolean(isOptional),
  // },
  brand: {
    notEmpty: true,
    errorMessage: (value, { req }) => req.t('INVALID_BRAND_NAME', { value }),
    optional: Boolean(isOptional),
  },
  currency: {
    optional: true,
  },
  quantity: {
    optional: Boolean(isOptional),
    isNumeric: true,
    trim: true,
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'quantity' }),
  },
  price: {
    optional: Boolean(isOptional),
    isNumeric: true,
    trim: true,
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'price' }),
  },
  discount: {
    optional: Boolean(isOptional),
    isNumeric: true,
    trim: true,
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'discount' }),
  },
  details: {
    optional: Boolean(isOptional),
    isArray: true,
    trim: true,
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'discount' }),
  },
  category: {
    trim: true,
    isMongoId: true,
    errorMessage: (value, { req }) => req.t('INVALID_FIELD', { field: 'category' }),
  },
});

const createProductPayload = productsPayload(false);
const createProductValidationSchema = checkSchema(createProductPayload);

const createProduct = asyncHandler(async (req, res) => {
  const ProductPayload = extractRequiredFields(Object.keys(createProductPayload), req.body);
  const Product = new Products(ProductPayload);
  await Product.save();
  res.status(201).json({ success: true });
});

module.exports = { createProduct, createProductValidationSchema, productsPayload };
