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
    custom: {
      async options(value, { req }) {
        const isExists = await Categories.findOne({ name: value });
        if (isExists) {
          throw new Error(req.t('CATEGORY_EXISTS'));
        }

        return true;
      },
    },
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
