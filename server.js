const http = require('http');
const cluster = require('cluster');
const os = require('os');
const app = require('./app');
// const { PORT } = require('./config/index');
const  PORT =4040;

if (cluster.isPrimary) {
  const numCPUs = Math.ceil(os.cpus().length / 2); // Using half of the available CPU cores

  //console.log(numCPUs);
  
  
  // Fork workers
  // for (let i = 0; i < numCPUs; i++) {
  for (let i = 0; i < 4; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    // console.log(`Worker ${worker.process.pid} died`);
    // Ensuring a new worker is spawned after an old one dies
    cluster.fork();
  });
} else {
  const server = http.createServer(app);

  async function startServer() {
    server.listen(PORT, () => {
      console.log(`Worker ${process.pid} - App is running on PORT ${PORT}`);
    });
  }

  startServer();
}
