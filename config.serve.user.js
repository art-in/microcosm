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
      protocol: 'https',
      host: 'artins.space',
      port: 6984,
      auth: {
        on: true,
        name: 'admin',
        password: 'artinsdb3'
      },
      dev: {
        start: false
      }
    }
  }
};
