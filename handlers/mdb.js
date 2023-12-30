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
};

module.exports = { ...mdb };
