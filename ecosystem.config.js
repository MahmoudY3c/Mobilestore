const { join } = require('path');
const { readFileSync } = require('fs');
const pack = readFileSync(join(__dirname, 'package.json'), 'utf8');

module.exports = {
  apps: [{
    name: pack.name,
    script: './cluster.js',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
