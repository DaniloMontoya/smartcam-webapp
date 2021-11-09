const PROXY_CONFIG = {
    '/rest': {
        //target: 'http://200.91.192.68:8088',
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }
};

module.exports = PROXY_CONFIG;
