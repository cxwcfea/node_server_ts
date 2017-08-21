import * as _ from 'lodash';
import * as mongoose from 'mongoose';

require('mongoose').Promise = require('bluebird');

const defaultOptions = {
  poolSize: 5,
  keepAlive: 1,
  useMongoClient: true,
};

function connect(mongoStr: string, options: mongoose.ConnectionOptions = {}): void {
  mongoose.connect(mongoStr, _.assign(defaultOptions, options));
  mongoose.connection.on('error', () => {
    console.error('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
    process.exit(0);
  });
  mongoose.connection.once('open', () => {
    console.log('mongo db opened');
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
}

function gracefulShutdown(msg, callback) {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through %s', msg);
    callback();
  });
}

// restart
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

export default connect;
