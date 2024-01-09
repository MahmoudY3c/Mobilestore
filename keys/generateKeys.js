const crypto = require('crypto');
const { writeFileSync } = require('fs');
const path = require('path');

function createPairKeys() {
  const pair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });
  console.log('Keys Generated Successfuly!!!');
  return pair
}

const saveObjectAsFile = function(obj, format = 'pem') {
  let files = []
  for(let [key, value] of Object.entries(obj)) {
    let file = path.join(__dirname, `./pem/${key}.${format}`);
    files.push(file);
    writeFileSync(file, value);
  }
  console.log(`=====================================`);
  console.log(`${files.join("\n")}`);
  console.log(`=====================================`);
}

saveObjectAsFile(createPairKeys())