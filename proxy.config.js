const PROXY_CONFIG = {
    '/rest': {
        target: 'http://200.91.192.68:8091',
        //target: 'http://localhost:8091',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }
};

module.exports = PROXY_CONFIG;
