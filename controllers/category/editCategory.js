const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Categories = require('../../db/models/Categories');
const { categoriesPayload } = require('./createCategory');


const editCategoryPayload = categoriesPayload(true);

const editCategoryValidationSchema = checkSchema(editCategoryPayload, ['body']);

const editCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const categoryData = extractRequiredFields(Object.keys(editCategoryPayload), req.body);
  const category = await Categories.findByIdAndUpdate(id, categoryData);
  if (!category) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'Category' }) });
  }

  res.status(200).json({ success: true });
});

module.exports = { editCategoryValidationSchema, editCategory };

