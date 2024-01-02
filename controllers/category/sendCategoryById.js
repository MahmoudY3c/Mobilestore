const Categories = require('../../db/models/Categories');
const { asyncHandler } = require('../../handlers/error');


const sendCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Categories.findOne({ _id: id });
  if (!category) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'Category' }) });
  }

  res.status(200).json(category);
});

module.exports = {
  sendCategoryById,
};

