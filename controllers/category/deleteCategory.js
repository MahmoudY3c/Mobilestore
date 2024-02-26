const { asyncHandler, ErrorMessages } = require('../../handlers/error');
const Categories = require('../../db/models/Categories');

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Categories.findByIdAndDelete(id);

  if (!category) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, id));
  }

  res.status(200).json({ success: true });
});

module.exports = { deleteCategory };

