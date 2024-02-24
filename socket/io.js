/* eslint-disable no-promise-executor-return */


const { Server } = require('socket.io');
const { delay } = require('../handlers');
const { handleWsMessagesEvents } = require('./events/messages');
const { logger } = require('../logger');

let io = null;
let ws = null;

const initIoConnection = server => {
  io = new Server(server,
    {
      cors: {
        // origin: 'https://192.168.1.3:3000',
      },
    },
  );

  io.on('connection', socket => {
    console.log('a user connected', socket.id);
    ws = socket;

    socket.on('error', error => {
      logger.error('io error occured:', error);
    });

    socket.on('ping', () => {
      logger.info('io ping packet received');
    });

    socket.on('reconnect', attempt => {
      logger.info('a client successfully reconnect after: ', attempt, 'times');
    });

    socket.on('reconnect_attempt', attempt => {
      logger.info('a client attempt to reconnect: ', attempt, 'times');
    });

    socket.on('reconnect_error', error => {
      logger.error('a client reconnect error:', error);
    });

    socket.on('reconnect_failed', attempt => {
      logger.error('sorry reconnect failed after:', attempt, 'times');
    });

    socket.on('disconnect', reason => {
      logger.info('user disconnected', reason);
    });

    socket.on('disconnecting', reason => {
      logger.info('user disconnecting', reason);
    });

    socket.on('connect_error', error => {
      logger.error('socket connection error', error);
    });

    socket.on('connect', () => {
      logger.info('user connected successfully', socket.id);
    });

    socket.on('connect_timeout', () => {
      logger.warn('io connection timeout', socket.id);
    });

    socket.on('reconnecting', () => {
      logger.info('io trying to reconnect', socket.id);
    });

    handleWsMessagesEvents({ socket, io });
  });
};

// a recursive function that return promise chain until socket connection is established
// can be used to emit socket events from external routes instead of attach io to app.io or req.io
const getSocket = () => new Promise(resolve => {
  const { io, socket } = { io, socket: ws };

  if (socket && io) {
    resolve({ io, socket });
  } else {
    return delay(300)
      .then(() => {
        if (socket && io) {
          resolve({ io, socket });
        } else {
          return getSocket();
        }
      });
  }
});

module.exports = {
  initIoConnection,
  getSocket,
};
