const bunyan = require('bunyan');

const appname = 'Shopsy';

module.exports = {
  applicationName: appname,
  logger: bunyan.createLogger({ name: appname }),
  mongodb: {
    uri: 'mongodb://localhost:37017/shopsy'
  },
  redis: {
    options: { port: 7379 }
  },
  mysql: {
    options: {
      host: 'localhost',
      port: 3406,
      username: 'root',
      password: 'password',
      database: 'shopsy',
      dialect: 'mysql'
    }
  }
};
