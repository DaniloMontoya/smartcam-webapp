const PROXY_CONFIG = {
    '/rest': {
        target: location.hostname,
        //target: 'http://costera.moviint.net',
        //target: 'http://demo.moviint.net:8090',
        //target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }
};

module.exports = PROXY_CONFIG;