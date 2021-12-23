const PROXY_CONFIG = {
    '/rest': {
        target: location.hostname,
        //target: 'http://costera.moviint.net/',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }
};

module.exports = PROXY_CONFIG;