const PROXY_CONFIG = {
    '/rest': {
<<<<<<< HEAD
        target: location.hostname,
        //target: 'http://costera.moviint.net',
        //target: 'http://demo.moviint.net:8090',
        //target: 'http://localhost:8090',
=======
        //target: 'http://200.91.192.68:8088',
        target: 'http://localhost:8088',
>>>>>>> origin/master
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }
};

<<<<<<< HEAD
module.exports = PROXY_CONFIG;
=======
module.exports = PROXY_CONFIG;
>>>>>>> origin/master
