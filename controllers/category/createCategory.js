const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields } = require('../../handlers');
const Categories = require('../../db/models/Categories');

const categoriesPayload = isOptional => ({
  name: {
    trim: true,
    notEmpty: true,
    optional: isOptional,
    errorMessage: (value, { req }) => req.t('INVALID_VALUE', { value }),
  },
});

const createCategoryPayload = categoriesPayload(false);
const createCategoryValidationSchema = checkSchema(createCategoryPayload);

const createCategory = asyncHandler(async (req, res) => {
  const categoryPayload = extractRequiredFields(Object.keys(createCategoryPayload), req.body);
  const category = new Categories(categoryPayload);
  await category.save();
  res.status(201).json({ success: true });
});

module.exports = { createCategory, createCategoryValidationSchema, categoriesPayload };
