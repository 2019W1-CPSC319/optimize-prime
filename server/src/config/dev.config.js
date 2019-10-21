const path = require('path');
// const tokens = require('./tokens.js');

module.exports = {

  server: {
    // Configure the port or named pipe the server should listen for connections on.
    // process.env.PORT tries to resolve the port or pipe from the environment.
    // It should work out of the box for Azure AppServices or IIS running IISNode.
    portOrPipe: process.env.PORT || 3000,

    // This setting enables automatic generation of SSL certificates for development mode.
    // You should disable this setting in production.
    developerSSL: true,

    // The directory where log files are created. Note the process MUST have write permissions to this directory.
    logDir: path.resolve(__dirname, '../../logs'),

    // This is the folder where static assets (the client) should be served from.
    staticRoot: path.resolve(__dirname, '../../../dist/client'),
  },
  auth: {
    // ...tokens,
    sessionSecret: 'URJFhFZcg4E8tOhYjhJw6W7W6pEEboS2',
    redirectUrl: 'https://localhost:3000/auth',
    policyName: 'B2C_1A_SignInWithADFSIdp',

    scope: 'user.read',

  },
};
