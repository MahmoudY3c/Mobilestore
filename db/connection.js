const mongoose = require('mongoose');
const { mongoURI } = require('../config');

mongoose.set('strictQuery', true);
mongoose.connect(mongoURI);

console.log('====================================');
console.log(mongoURI);
console.log('====================================');

const { connection } = mongoose;

connection.on('error', e => {
  console.log(e);
});

connection.once('open', () => {
  console.log('connected to db');
});

module.exports = connection;

