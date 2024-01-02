
const { v4: uuid } = require('uuid');
const fs = require('fs');
const { logger } = require('../logger');
const sharp = require('sharp');
const path = require('path');
const { SLIDER } = require('../config');

const handlers = {
  normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  },
  customizeErr(message, status) {
    const err = new Error();
    err.message = message;
    err.status = status;
    return err;
  },
  // eslint-disable-next-line no-unused-vars
  sendUserError(message, { payload, status } = {}) {
    return {
      error: {
        message,
        ...(payload || {}),
      },
    };
  },
  readDataFile(filePath) {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '{}');
    }

    let data = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(data || '{}');
    return data;
  },
  saveModifiedDataFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  },
  modifyAndSaveData({ filePath, fileHistory, data, key }) {
    fileHistory[key] = data;
    // saving tasks
    handlers.saveModifiedDataFile(filePath, fileHistory);
  },
  defineDataToFile(filePath, data, key) {
    try {
      // getting task history
      const fileHistory = handlers.readDataFile(filePath);
      handlers.modifyAndSaveData({ filePath, fileHistory, data, key });
      return fileHistory;
    } catch (error) {
      console.error('Error saving tasks to JSON file:', error);
    }
  },
  uniqueId() {
    const filename = uuid();
    const timestamp = Date.now();
    return `${filename}--${timestamp}`;
  },
  extractRequiredFields(fieldsNames, fieldsContainer, payload = {}) {
    for (const name of fieldsNames) {
      if (fieldsContainer[name]) {
        payload[name] = fieldsContainer[name];
      }
    }

    return payload;
  },
  compressImages(filePath, fileType) {
    const supportedTypes = ['JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF', 'TIFF'];
    if (supportedTypes.includes(fileType.toUpperCase())) {
      console.log('supported.....');

      sharp(filePath)
        .toBuffer((err, data) => {
          if (err) {
            logger.error(err);
          }

          fs.writeFile(filePath, data, error => {
            if (error) {
              logger.error(error);
            }
          });
        });
    }
  },
  resizeSliderImage(imgBuffer, { height = SLIDER.height || 500, width = SLIDER.width || 500, outputLocation } = {}) {
    const filename = outputLocation
      ? outputLocation.split('/')[outputLocation.split('/').length - 1]
      : `${handlers.uniqueId()}.webp`;

    outputLocation = outputLocation
      ? outputLocation
      : path.join(__dirname, '../uploads');


    if (!fs.existsSync(outputLocation)) {
      fs.mkdirSync(outputLocation);
    }

    const outputFile = path.join(outputLocation, filename);

    return new Promise((resolve, reject) => {
      sharp(imgBuffer)
        .resize(width, height, {
          fit: sharp.fit.fill,
        })
        // eslint-disable-next-line no-unused-vars
        .toFile(outputFile, (err, info) => {
          if (err) reject(err);
          // console.log(info);
          resolve(filename);
        });
    });
  },
  deleteFile(filePath) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      logger.error(err);
    }
  },
  createFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  },
  createFile(folderPath, contents) {
    fs.writeFileSync(folderPath, contents || '');
  },
};

module.exports = { ...handlers };

