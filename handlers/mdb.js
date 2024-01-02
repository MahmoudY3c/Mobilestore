const { cloudinary } = require('../cloudinary');

const mdb = {
  autoPopulate(items) {
    items = items.constructor === Array ? items : [items];

    return function (next) {
      for (let i = 0; i < items.length; i++) {
        this.populate(items[i]);
      }

      next();
    };
  },
  virtualImagesPath(schema, propertyName) {
    schema.virtual(propertyName || 'imagePath').get(function () {
      let url = new URL(cloudinary.url('uploads'));
      url = url.protocol === 'http:'
        ? `https://${url.host}${url.pathname}`
        : url.href;
      return `${url}/${this[propertyName || 'imagePath']}`;
    });
  },
};

module.exports = { ...mdb };
