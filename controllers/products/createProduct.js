const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Products = require('../../db/models/Products');
const ProductDetails = require('../../db/models/ProductDetails');
const Categories = require('../../db/models/Categories');
const multer = require('multer');

const productsPayload = isOptional => ({
  name: {
    optional: Boolean(isOptional),
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
  files: {
    optional: Boolean(isOptional),
    custom: {
      options(value, { req }) {
        // console.log(req?.files);
        const isAllNotBuffer = req?.files?.every(e => e?.buffer instanceof Buffer);

        if (!isAllNotBuffer) {
          throw new Error(req.t('INVALID_MSG', { field: 'images' }));
        }

        return true;
      },
    },
  },
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
    custom: {
      async options(value, { req }) {
        try {
          JSON.parse(value);
          return true;
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
          throw new Error(req.t('INVALID_MSG', { field: 'details' }));
        }
      },
    },
    notEmpty: true,
    // isObject: true,
    errorMessage: (value, { req }) => req.t('INVALID_MSG', { field: 'details' }),
  },
  category: {
    optional: Boolean(isOptional),
    trim: true,
    isMongoId: true,
    errorMessage: (value, { req }) => req.t('INVALID_ID', { id: value }),
    custom: {
      async options(value, { req }) {
        const isCategoryExists = await Categories.findById(value);
        if (!isCategoryExists) {
          throw new Error(req.t('NOT_FOUND', { field: 'category' }));
        }
      },
    },
  },
});

const upload = multer();
const productUpload = upload.array('images');

const createProductPayload = productsPayload(false);
const createProductValidationSchema = checkSchema(createProductPayload);

const createProduct = asyncHandler(async (req, res) => {
  const ProductPayload = extractRequiredFields(Object.keys(createProductPayload), req.body);
  const { result } = req;
  ProductPayload.images = result.map(e => ({
    image: e.fileUrl,
    fileTitle: e.fileTitle,
    fileName: e.filename,
  }));

  let { details } = ProductPayload;
  delete ProductPayload.details;
  const Product = new Products(ProductPayload);

  if (details) {
    details = JSON.parse(details);
    const productDetails = new ProductDetails({ ...details, product: Product._id });
    Product.details = productDetails._id;
    await productDetails.save();
  }

  await Product.save();
  res.status(201).json({ success: true });
});

module.exports = { createProduct, createProductValidationSchema, productsPayload, productUpload };
