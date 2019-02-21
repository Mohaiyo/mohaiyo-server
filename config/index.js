module.exports = {
    // development config
    development: {
        mongo: {
            uri: 'mongodb://localhost:27017/wayne'
        },
        port: 8080
    },
    // production config
    production: {
        mongo: {
            uri: 'mongodb://localhost:27017/wayne'
        },
        port: 8010
    }
}