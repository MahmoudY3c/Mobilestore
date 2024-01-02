
const { Router } = require('express');
const router = Router();
const { createCategory } = require('../../controllers/category/createCategory.js');
const { deleteCategory } = require('../../controllers/category/deleteCategory.js');
const { editCategory } = require('../../controllers/category/editCategory.js');
const { sendCategories } = require('../../controllers/category/sendCategories.js');
const { sendCategoryById } = require('../../controllers/category/sendCategoryById.js');

router.post(
  '/',
  createCategory,
);

router.delete(
  '/',
  deleteCategory,
);

router.put(
  '/',
  editCategory,
);

router.get(
  '/',
  sendCategories,
);

router.get(
  '/:id',
  sendCategoryById,
);

module.exports = router;

