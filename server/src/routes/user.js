const router = require('express').Router();
const axios = require('axios');
const notAuthMiddleware = require('../utils/notAuthMiddleware');

router.get('/profile', notAuthMiddleware, async (req, res) => {
  try {
    const response = await axios({
      url: 'https://graph.microsoft.com/v1.0/users/me',
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    });

    res.send(response.data);
  } catch (err) {
    res.status(err.response.status).send(err.message);
  }
});

module.exports = router;
