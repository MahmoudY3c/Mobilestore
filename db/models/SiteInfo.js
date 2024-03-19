const mongoose = require('mongoose');
const { Schema } = mongoose;

const SiteInfoSchema = new Schema({
  logo: { type: Object },
  name: { type: String },
  description: { type: String },  
  social: [
    {
      _id: false,
      name: { type: String },
      icon: { type: String },
      url: { type: String },
    }
  ],
  // facebook: { type: String },
  // twitter: { type: String },
  // tiktok: { type: String },
  // telegram: { type: String },
  // whatsapp: { type: String },
  // phoneNumber: { type: String },
}, { timestamps: true });

const SiteInfo = mongoose.models.SiteInfo
  ? mongoose.model('SiteInfo')
  : mongoose.model(
    'SiteInfo',
    SiteInfoSchema,
  );

module.exports = SiteInfo;

