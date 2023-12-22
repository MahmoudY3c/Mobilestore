const { APP_NAME } = require('../../config');


const renderMainPage = function (req, res) {
  res.render('index', { title: APP_NAME });
};

module.exports = {
  renderMainPage,
};

