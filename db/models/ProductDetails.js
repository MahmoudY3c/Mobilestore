const { default: mongoose } = require('mongoose');
const { Schema } = mongoose;

const ProductDetailsSchema = new Schema({
  camera: {
    type: String,
  },
  screen: {
    type: String,
  },
  screenType: {
    type: String,
  },
  battery: {
    type: String,
  },
  network: {
    type: String,
  },
  operatingSystem: {
    type: String,
  },
  cpuSpeed: {
    type: String,
  },
  headPhonePort: {
    type: String,
  },
  warranty: {
    type: String,
  },
  memory: {
    type: String,
  },
  ram: {
    type: String,
  },
  numberOfSim: {
    type: String,
  },
});

module.exports = mongoose.models.ProductDetails
  ? mongoose.model('ProductDetails')
  : mongoose.model(
    'ProductDetails',
    ProductDetailsSchema,
  );
