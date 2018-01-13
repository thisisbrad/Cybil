const bunyan = require('bunyan');

const appname = 'Shopsy';

module.exports = {
  applicationName: appname,
  logger: bunyan.createLogger({ name: appname }),
  mongodb: {
    uri: 'mongodb://localhost:37017/shopsy'
  }
};
