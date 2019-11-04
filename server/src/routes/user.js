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
                address: 'candicekhpang@hotmail.com.hk',
              },
            },
            {
              emailAddress: {
                address: 'martinjohansen1705@gmail.com',
              },
            },
          ],
        },
      },
    });
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

router.post('/createevent', notAuthMiddleware, async (req, res) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://graph.microsoft.com/v1.0/me/events',
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
      data: {
        subject: "Let's go for lunch",
        body: {
          contentType: 'HTML',
          content: 'Does late morning work for you?',
        },
        start: {
          dateTime: '2019-11-03T12:00:00',
          timeZone: 'Pacific Standard Time',
        },
        end: {
          dateTime: '2019-11-03T14:00:00',
          timeZone: 'Pacific Standard Time',
        },
        location: {
          displayName: "Harry's Bar",
        },
        attendees: [
          {
            emailAddress: {
              address: 'alicekim@optimizeprime.onmicrosoft.com',
              name: 'Alice Kim',
            },
            type: 'required',
          },
        ],
      },
    });
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
