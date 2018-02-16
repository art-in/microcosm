/* global module */
module.exports = {
  server: {
    static: {
      host: '0.0.0.0',
      port: 3000,

      secure: {
        enabled: false,
        key: 'path/to/key.pem',
        cert: 'path/to/cert.pem'
      }
    },

    database: {
      protocol: 'http',
      host: 'localhost',
      port: 5984,
      dev: {
        start: true
      }
    }
  }
};
