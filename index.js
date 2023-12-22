const app = require('./app');
const http = require('http');
const { onServerError, onSeverListening } = require('./events/server');
const { PORT } = require('./config');
require('./db/connection');

// const port = normalizePort(process.env.PORT || '3000');
app.set('port', PORT);


const server = http.createServer(app);

server.listen(PORT);
server.on('error', error => onServerError(error, PORT));
server.on('listening', () => onSeverListening(server));
