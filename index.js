const app = require('./app');
const http = require('http');
const { onServerError, onSeverListening } = require('./events/server');
const { PORT } = require('./config');
const { initIoConnection } = require('./socket/io');
require('./db/connection');

const server = http.createServer(app);
initIoConnection(server);

server.listen(PORT, '0.0.0.0');
server.on('error', error => onServerError(error, PORT));
server.on('listening', () => onSeverListening(server));
