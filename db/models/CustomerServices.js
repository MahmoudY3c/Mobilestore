const { default: mongoose } = require('mongoose');
const { SERVICE } = require('../../config');
const { Schema } = mongoose;

const CustomerServicesSchema = new Schema({
  phoneType: {
    type: String,
  },
  serviceType: {
    type: String,
  },
  serviceCost: {
    type: String,
  },
  serviceStatus: {
    type: String,
    enum: SERVICE.type,
  },
  warantiDuration: {
    type: String,
  },
});

module.exports = mongoose.models.CustomerServices
  ? mongoose.model('CustomerServices')
  : mongoose.model(
    'CustomerServices',
    CustomerServicesSchema,
  );
