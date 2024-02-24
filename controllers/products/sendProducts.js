const Products = require('../../db/models/Products');
const { asyncHandler } = require('../../handlers/error');

const sendProducts = asyncHandler(async (req, res) => {
  const { category, skip = 0, limit = 14 } = req.query;
  const query = {};
  // handle get products for specific category
  if (category) {
    query.category = category;
  }

  // console.log(req.query);
  const products = await Products.find(query, {}, { skip: Number(skip), limit: Number(limit) });
  const numberOfProducts = await Products.countDocuments(query);
  res.status(200).json({ data: products, length: numberOfProducts });
});

module.exports = {
  sendProducts,
};

