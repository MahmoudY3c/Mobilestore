

const cluster = require('cluster');
const os = require('os');
const path = require('path');
const cpuCount = os.cpus().length;
console.log(`The total number of CPUs is ${cpuCount}`);
console.log(`Primary pid=${process.pid}`);
cluster.setupPrimary({
  exec: path.join(__dirname, 'index.js'),
});

if (cluster.isMaster) {
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  console.log('at master...');
}

cluster.on('exit', (worker, code, signal) => {
  console.log(code, '========== code ===========', signal, '============ signal ===========');
  console.log(`worker ${worker.process.pid} has been killed`);
  console.log('Starting another worker');
  cluster.fork();
});
