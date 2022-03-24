const HOST_PROD = location.hostname
const HOST_DEV = "costera.moviint.net"
const HOST_DEMO = "demo.moviint.net:8090"
const HOST_TEST = `localhost:8090`
export const HOST = HOST_PROD
export const DOMAIN_URL = `http://${HOST}`
export const WEBSOCKET_URL = `ws://${HOST}`
export const REST_URL = `${DOMAIN_URL}/rest/v1`
