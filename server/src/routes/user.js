const router = require('express').Router();
const axios = require('axios');
const notAuthMiddleware = require('../utils/notAuthMiddleware');

router.get('/profile', notAuthMiddleware, async (req, res) => {
  try {
    const response = await axios({
      url: 'https://graph.microsoft.com/v1.0/me',
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    });

    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(err.response.status).send(err.message);
  }
});

router.get('/events', notAuthMiddleware, async (req, res) => {
  try {
    const response = await axios({
      url: 'https://graph.microsoft.com/v1.0/me',
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    });

    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(err.response.status).send(err.message);
  }
});

router.post('/sendEmail', notAuthMiddleware, async (req, res) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://graph.microsoft.com/v1.0/me/sendMail',
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
      data: {
        message: {
          subject: req.body.subject,
          body: {
            contentType: 'text',
            content: req.body.body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: req.body.candidate,
              },
            },
          ],
          ccRecipients: []
        },
      },
    });
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
