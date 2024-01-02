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
  brand: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  discount: {
    type: Number,
  },
  has_coupon: {
    type: Boolean,
    default: false,
  },
  details: {
    type: mongoose.Types.ObjectId,
    ref: 'ProductDetails',
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Categories',
    required: true,
  },
}, { timestamps: true });

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
