

const { APP_NAME } = require('../config');
const debug = require('debug')(APP_NAME);
const dns = require('dns');
const os = require('os');
const { Server: httpsServer } = require('https');

const events = {
  onServerError(error, port) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  },
  onSeverListening(server) {
    const addr = server.address();
    const protocol = server instanceof httpsServer ? 'https' : 'http';
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Listening on ' + bind);

    dns.lookup(
      os.hostname(),
      {
        family: 4,
        all: true,
      },
      (err, addresses) => {
        console.log(addresses);
        if (err) throw err;
        // console.log(addresses)
        const localAddress = addresses.at(-1).address;
        console.log(`Vist ${protocol}://${localAddress}:${addr.port}/`);
      },
    );
  },
};


module.exports = events;
