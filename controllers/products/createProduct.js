const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Products = require('../../db/models/Products');
const ProductDetails = require('../../db/models/ProductDetails');
const multer = require('multer');

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
  // files: {
  //   optional: Boolean(isOptional),
  //   custom: {
  //     options(value, { req }) {
  //       const isAllNotBuffer = value?.every(e => e?.buffer instanceof Buffer);
  //       if (!isAllNotBuffer) {
  //         throw new Error(req.t('INVALID_MSG', { field: 'images' }));
  //       }

  //       return true;
  //     },
  //   },
  // },
  brand: {
    notEmpty: true,
    errorMessage: (value, { req }) => req.t('INVALID_BRAND_NAME', { value }),
    // optional: Boolean(isOptional),
    optional: true,
  },
  currency: {
    notEmpty: true,
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'currency' }),
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
    // optional: Boolean(isOptional),
    optional: true,
    isNumeric: true,
    trim: true,
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'discount' }),
  },
  details: {
    optional: Boolean(isOptional),
    isObject: true,
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'details' }),
  },
  category: {
    trim: true,
    isMongoId: true,
    errorMessage: (value, { req }) => req.t('INVALID_ID', { id: value }),
  },
});

const upload = multer();
const productUpload = upload.array('images');

const createProductPayload = productsPayload(false);
const createProductValidationSchema = checkSchema(createProductPayload);

const createProduct = asyncHandler(async (req, res) => {
  const ProductPayload = extractRequiredFields(Object.keys(createProductPayload), req.body);
  const { details } = ProductPayload;
  delete ProductPayload.details;
  const Product = new Products(ProductPayload);

  if (details) {
    const productDetails = new ProductDetails({ ...details, product: Product._id });
    Product.details = productDetails._id;
    await productDetails.save();
  }

  await Product.save();
  res.status(201).json({ success: true });
});

module.exports = { createProduct, createProductValidationSchema, productsPayload, productUpload };
