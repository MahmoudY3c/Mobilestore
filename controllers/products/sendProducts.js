const Products = require('../../db/models/Products');
const { asyncHandler } = require('../../handlers/error');

const sendProducts = asyncHandler(async (req, res) => {
  const { category, q, name, skip = 0, limit = 14 } = req.query;
  const query = {};
  if (category) {
    query.category = category;
  }

  // handling search
  if (q) {
    const search = {
      name: {
        $regex: new RegExp(q, 'gi'),
      },
    };

    const products = await Products.find(search, name ? { name: 1, images: 1, price: 1, currency: 1 } : {}, { skip: Number(skip), limit: Number(limit) });
    const numberOfProducts = await Products.countDocuments(search);
    return res.status(200).json({ data: products, length: numberOfProducts });
  }

  // console.log(req.query);
  const products = await Products.find(query, {}, { skip: Number(skip), limit: Number(limit) });
  const numberOfProducts = await Products.countDocuments(query);
  res.status(200).json({ data: products, length: numberOfProducts });
});

module.exports = {
  sendProducts,
};

