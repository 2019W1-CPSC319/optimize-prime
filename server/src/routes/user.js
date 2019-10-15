const router = require('express').Router();
const axios = require('axios');
const graph = require("../utils/graph")

router.get('/profile', async (req, res) => {
  try {
    const response = await axios({
      url: 'https://graph.microsoft.com/v1.0/users/me',
      headers: {
        Authorization: "Bearer " + req.user.accessToken

      }
    })
    
    res.send(response.data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
