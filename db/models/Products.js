const { default: mongoose } = require('mongoose');
const { autoPopulate } = require('../../handlers/mdb');
const { Schema } = mongoose;

const ProductsSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  images: {
    type: Array,
  },
  company: {
    type: String,
  },
  quantity: {
    type: String,
  },
  price: {
    type: String,
  },
  discount: {
    type: String,
  },
  has_coupon: {
    type: Boolean,
    default: false,
  },
  details: {
    type: mongoose.Types.ObjectId,
    ref: 'ProductDetails',
  },
});

ProductsSchema
  .pre('findOne', autoPopulate('details'))
  .pre('find', autoPopulate('details'));

const Products = mongoose.models.Products
  ? mongoose.model('Products')
  : mongoose.model(
    'Products',
    ProductsSchema,
  );

module.exports = Products;
