
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategoriesSchema = new Schema({
  name: {
    type: String,
  },
  titles: {
    type: Object,
  },
}, { timestamps: true });

const Categories = mongoose.models.Categories
  ? mongoose.model('Categories')
  : mongoose.model(
    'Categories',
    CategoriesSchema,
  );

module.exports = Categories;
