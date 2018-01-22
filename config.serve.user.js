/* global module */
module.exports = {
    
    server: {

        static: {
            host: '0.0.0.0',
            port: 3000
        },

        database: {
            host: 'localhost',
            port: 5984,
            dev: {
                start: true
            }
        }
        
    }

};