require('log-timestamp');

import * as http from 'http';
import app from './app';
import connectMongo from './db/mongo/connector';

require('dotenv').config({ path: 'variables.env' });
global.Promise = require('bluebird');

function startServer() {
  if (process.env.DB === 'mongo') {
    connectMongo(process.env.MongoUri);
  }
  const server = http.createServer(app);
  const port = app.get('port');

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = `Port ${port}`;

    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', () => {
    const addr = server.address();
    const bind = `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
  });

  server.listen(port);
}

if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}
