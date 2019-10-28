const router = require('express').Router();

// TODO: Remove when database connected
const users = [
  {
    id: '1',
    lastName: 'Evans',
    firstName: 'Chris',
    email: 'c.evans@gmail.com',
    job: 'University of British Columbia',
    role: 'candidate',
    password: '***',
  },
];

router.get('/', (req, res) => {
  // TODO: Update when database connected
  res.send(users);
});

router.post('/', (req, res) => {
  const user = req.body;
  // TODO: Update when database connected
  users.push(user);
  res.send(user);
});

module.exports = router;
