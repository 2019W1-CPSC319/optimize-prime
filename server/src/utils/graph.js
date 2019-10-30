const graph = require('@microsoft/microsoft-graph-client');

module.exports = {
  getUserDetails: async (accessToken) => {
    const client = getAuthenticatedClient(accessToken);
    const user = await client.api('/me').get();
    return user;
  },
};

const getAuthenticatedClient = (accessToken) => {
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  return client;
};
