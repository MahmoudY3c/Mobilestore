const { asyncHandler } = require('../../handlers/error');
const Products = require('../../db/models/Products');
const ProductDetails = require('../../db/models/ProductDetails');
const { cleanupFiles } = require('../../cloudinary');
const { logger } = require('../../logger');

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Products.findByIdAndDelete(id);
  await ProductDetails.findOneAndDelete({ product: id });

  if (!product) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: id }) });
  }

  try {
    await cleanupFiles(product, 'images');
  } catch (err) {
    logger.error(err);
  }

  res.status(200).json({ success: true });
});

module.exports = { deleteProduct };

