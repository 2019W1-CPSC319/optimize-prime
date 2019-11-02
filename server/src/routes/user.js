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
    console.error(err);
    res.status(err.response.status).send(err.message);
  }
});

router.post('/sendemail', notAuthMiddleware, async (req, res) => {
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
                address: 'aliceykim0828@gmail.com',
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

router.get('/findMeetingTimes', notAuthMiddleware, async (req, res) => {
  try {
    const response = await axios({
      url: 'https://graph.microsoft.com/v1.0/users/me/findMeetingTimes',
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
