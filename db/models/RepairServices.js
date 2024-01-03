const { default: mongoose } = require('mongoose');
const { SERVICE } = require('../../config');
const { Schema } = mongoose;

const RepairServicesSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  phoneType: {
    type: String,
  },
  serviceType: {
    type: String,
  },
  serviceCost: {
    type: Number,
  },
  serviceCurrency: {
    type: String,
    default: 'USD',
  },
  serviceStatus: {
    type: String,
    enum: SERVICE.type,
    default: 'pending',
  },
  warantiDuration: {
    type: String,
  },
}, { timestamps: true });

const RepairServices = mongoose.models.RepairServices
  ? mongoose.model('RepairServices')
  : mongoose.model(
    'RepairServices',
    RepairServicesSchema,
  );

module.exports = RepairServices;

