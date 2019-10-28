const router = require('express').Router();

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
  res.send(users);
});

router.post('/', (req, res) => {
  const user = req.body;
  users.push(user);
  res.send('User added!');
});

module.exports = router;
