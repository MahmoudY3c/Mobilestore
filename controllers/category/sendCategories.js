const Categories = require('../../db/models/Categories');
const { asyncHandler } = require('../../handlers/error');

const sendCategories = asyncHandler(async (req, res) => {
  const categories = await Categories.find();
  const numberOfProducts = await Categories.countDocuments({ });
  res.status(200).json({ data: categories, length: numberOfProducts });
});

module.exports = {
  sendCategories,
};

