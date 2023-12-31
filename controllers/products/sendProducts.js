const Products = require('../../db/models/Products');
const { asyncHandler } = require('../../handlers/error');

const sendProducts = asyncHandler(async (req, res) => {
  const { category, skip = 0, limit = 14 } = req.query;
  // console.log(req.query);
  const products = await Products.find({ category }, {}, { skip: Number(skip), limit: Number(limit) });
  const numberOfProducts = await Products.countDocuments({ category });
  res.status(200).json({ data: products, length: numberOfProducts });
});

module.exports = {
  sendProducts,
};

