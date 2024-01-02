const Products = require('../../db/models/Products');
const { asyncHandler } = require('../../handlers/error');


const sendProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Products.findOne({ _id: id });
  if (!product) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: id }) });
  }

  res.status(200).json(product);
});

module.exports = {
  sendProductById,
};

