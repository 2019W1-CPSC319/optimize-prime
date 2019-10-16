const http = require('http');
const https = require('https');
const generateCertificate = require('../utils/generateCertificate');

module.exports = (app, log, serverConfig) => new Promise((resolve, reject) => {
  const server = serverConfig.developerSSL
    ? https.createServer(generateCertificate(), app)
    : http.createServer(app);

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      reject(new Error('SYSCALL error'));
    }
    switch (error.code) {
      case 'EACCES':
        reject(new Error(`Unable to bind to port or pipe "${this._internalConfig.portOrPipe}". Insufficient priveliges.`));
        break;
      case 'EADDRINUSE':
        reject(new Error(`Unable to bind to port or pipe "${this._internalConfig.portOrPipe}". It's already in use.`));
        break;
      default:
    }
  });
  server.listen(serverConfig.portOrPipe, () => {
    log.info(`${serverConfig.developerSSL ? 'Secure server' : 'Server'} ready on port "${serverConfig.portOrPipe}"`);
    resolve(server);
  });
});
