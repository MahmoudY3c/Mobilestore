const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Products = require('../../db/models/Products');
const ProductDetails = require('../../db/models/ProductDetails');
const { productsPayload } = require('./createProduct');
const { cleanupFiles } = require('../../cloudinary');

const editProductPayload = productsPayload(true);
const editProductValidationSchema = checkSchema(editProductPayload, ['body']);

const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ProductData = extractRequiredFields(Object.keys(editProductPayload), req.body);
  let { details } = ProductData;
  const { result } = req;

  if (result) {
    ProductData.images = result.map(e => ({
      image: e.fileUrl,
      fileTitle: e.fileTitle,
      fileName: e.filename,
    }));
  }

  delete ProductData.details;

  if (details) {
    details = JSON.parse(details);
    const productDetails = await ProductDetails.findOneAndUpdate({ product: id }, details, {
      new: true,
    });

    if (!productDetails) {
      return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'productDetails' }) });
    }
  }

  if (details && !Object.keys(ProductData).length) {
    return res.status(200).json({ success: true });
  }

  const Product = await Products.findByIdAndUpdate(id, ProductData);

  // cleanup images
  if (ProductData.images) {
    await cleanupFiles(Product, 'images');
  }

  if (!Product) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'Product' }) });
  }

  res.status(200).json({ success: true });
});

module.exports = { editProductValidationSchema, editProduct };

