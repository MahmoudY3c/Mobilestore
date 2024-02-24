const Products = require('../../db/models/Products');
const { asyncHandler } = require('../../handlers/error');

// a query search middleware to get products route
const findProductByName = asyncHandler(async (req, res, next) => {
  const { q, name, skip = 0, limit = 14 } = req.query;

  // handling search
  if (q) {
    const search = {
      name: {
        $regex: new RegExp(q, 'gi'),
      },
    };

    const products = await Products.find(search,
      name
        ? { name: 1, images: 1, price: 1, currency: 1, _id: 1 }
        : {},
      { skip: Number(skip), limit: Number(limit) },
    );

    const numberOfProducts = await Products.countDocuments(search);
    return res.status(200).json({ data: products, length: numberOfProducts });
  }

  next();
});

module.exports = {
  findProductByName,
};

