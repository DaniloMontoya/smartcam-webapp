const PROXY_CONFIG = {
    '/rest': {
        target: location.hostname,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }
};

module.exports = PROXY_CONFIG;
