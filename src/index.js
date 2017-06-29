if (process.env.NODE_ENV === 'development') {
  require('dotenv-safe').load();
}

const createApp = require('./app');
const logger = require('pino')();

const cluster = require('cluster');
const numCpus = require('os').cpus().length;

if (cluster.isMaster && process.env.NODE_ENV === 'production') {
  logger.info(`Master ${process.pid} is running`);

  for (let i = 0; i < (Number(process.env.MAX_WORKERS) || numCpus); i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (deadWorker, exitCode) => {
    const deadPID = deadWorker.process.pid;

    if (exitCode === 0) {
      logger.info(`Gracefully terminated process ${deadPID}.`);
    } else if (exitCode === 1) {
      logger.fatal(`Worker ${deadPID} died.`);

      // Restart worker
      const worker = cluster.fork();
      const newPID = worker.process.pid;

      logger.info(`New worker ${newPID} started to replace ${deadPID}.`);
    }
  });
} else {
  const options = {
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  };

  const app = createApp(options);
  app.listen(Number(process.env.PORT));
}
