const PROXY_CONFIG = {
    '/rest': {
        target: "http://200.91.192.68:8090",
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }
};

module.exports = PROXY_CONFIG;
