const Categories = require('../../db/models/Categories');
const { asyncHandler, ErrorMessages } = require('../../handlers/error');


const sendCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Categories.findOne({ _id: id });
  if (!category) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, 'Category'));
  }

  res.status(200).json(category);
});

module.exports = {
  sendCategoryById,
};

