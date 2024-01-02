const mongoose = require('mongoose');
const { SLIDER } = require('../../config');
const { Schema } = mongoose;

const SlidersSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
  },
  fileTitle: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: SLIDER.type,
  },
}, { timestamps: true });

const Sliders = mongoose.models.Sliders
  ? mongoose.model('Sliders')
  : mongoose.model(
    'Sliders',
    SlidersSchema,
  );

module.exports = Sliders;

