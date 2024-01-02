const { uniqueId, createFolder } = require('../handlers');
const fs = require('fs');
const path = require('path');

const uploadArrayBuffer = type => {
  const isSingleFile = type === 'single';

  createFolder(path.join(__dirname, '../uploads'));

  return async (req, res, next) => {
    if (isSingleFile) {
      const { file } = req;
      const filename = uniqueId();
      const name = `${filename}.${file.mimeType.split('/').at(-1)}`;
      fs.writeFileSync(file.buffer, path.join(__dirname, `../uploads/${name}`));
      const result = { ...file, filename };
      result.fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
      result.fileTitle = file.originalName;
      req.result = result;
    } else {
      const { files } = req;
      if (files.length > 0) {
        req.result = [];
        for (const file of files) {
          const filename = uniqueId();
          const name = `${filename}.${file.mimeType.split('/').at(-1)}`;
          fs.writeFileSync(file.buffer, path.join(__dirname, `../uploads/${name}`));
          const result = { ...file, filename };
          result.fileUrl = `${req.get('protocol')}://${req.get('host')}/${filename}`;
          result.fileTitle = file.originalName;
          req.result.push(result);
        }
      }
    }

    next();
  };
};

module.exports = uploadArrayBuffer;
