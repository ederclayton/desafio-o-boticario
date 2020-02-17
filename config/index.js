const config = require('./config');

module.exports = {
    getAPIAddress: function () {
        return (config.API && config.API.address) ? config.API.address : '0.0.0.0';
    },
    getAPIPort: function () {
        return (config.API && config.API.port) ? config.API.port : '3000';
    },
    getDbConnectionUri: function () {
        let dbConnectionUri  = 'mongodb://';

        // If so, add user and pass
        dbConnectionUri += (config.mongodb && config.mongodb.user && config.mongodb.pass) ?
                            config.mongodb.user + ':' + config.mongodb.pass + '@' : '';
        
        // If so, add address, if not add localhost address 
        dbConnectionUri += (config.mongodb && config.mongodb.address) ?
                            config.mongodb.address : '127.0.0.1';

        // If so, add port, if not add default port
        dbConnectionUri += (config.mongodb && config.mongodb.port) ?
                            ':' + config.mongodb.port : ':27017';
        
        // If so, add db name
        dbConnectionUri += (config.mongodb && config.mongodb.db) ?
                            '/' + config.mongodb.db : '/';
        
        return dbConnectionUri;
    },
    getJwtSecret: function () {
        return (config.jwt && config.jwt.secret) ? config.jwt.secret : '';
    },
    isCpfInWhiteList: function (cpf) {
        return config.whiteList.includes(cpf);
    },
    getExternalAPI: function () {
        return config.externalAPI ? config.externalAPI : '';
    }
};