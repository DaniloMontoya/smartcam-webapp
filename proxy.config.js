const PROXY_CONFIG = {
    '/rest': {
        target: location.host,
        //target: 'http://costera.moviint.net',
        //target: 'http://demo.moviint.net:8090',
        //target: 'http://localhost:8090',
        //target: 'http://via40.moviint.net',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }
};

module.exports = PROXY_CONFIG;
