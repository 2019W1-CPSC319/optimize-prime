const router = require('express').Router();

// TODO: Remove when database connected
const users = [
  {
    id: 1,
    lastName: 'Evans',
    firstName: 'Chris',
    email: 'c.evans@gmail.com',
    job: 'University of British Columbia',
    role: 'candidate',
    password: '***',
  },
  {
    id: 2,
    lastName: 'Downey Jr.',
    firstName: 'Robert',
    job: 'Simon Fraser University',
    email: 'r.downey@gmail.com',
    password: '********',
    role: 'candidate',
  },
  {
    id: 3,
    lastName: 'Johansen',
    firstName: 'Scarlet',
    job: 'British Columbia Institue of Technology',
    email: 's.johansen@gmail.com',
    password: '********',
    role: 'candidate',
  },
  {
    id: 4,
    lastName: 'Holland',
    firstName: 'Tom',
    job: 'University of Waterloo',
    email: 't.holland@gmail.com',
    password: '********',
    role: 'candidate',
  },
  {
    id: 5,
    lastName: 'Cumberbatch',
    firstName: 'Benedict',
    job: 'University of Victoria',
    email: 'b.cumberbatch@gmail.com',
    password: '********',
    role: 'candidate',
  },
  {
    id: 6,
    lastName: 'America',
    firstName: 'Captain',
    job: 'Senior Project Manager',
    email: 'c.america@galvanize.com',
    password: '********',
    role: 'admin',
  },
  {
    id: 7,
    lastName: 'Man',
    firstName: 'Iron',
    job: 'UX Designer',
    email: 'i.man@galvanize.com',
    password: '********',
    role: 'admin',
  },
  {
    id: 8,
    lastName: 'Widow',
    firstName: 'Black',
    job: 'Junior Software Developer',
    email: 'b.widow@galvanize.com',
    password: '********',
    role: 'admin',
  },
  {
    id: 9,
    lastName: 'Man',
    firstName: 'Spider',
    job: 'Business Analyst',
    email: 's.man@galvanize.com',
    password: '********',
    role: 'admin',
  },
  {
    id: 10,
    lastName: 'Strange',
    firstName: 'Dr.',
    job: 'Senior Project Owner',
    email: 'd.strange@galvanize.com',
    password: '********',
    role: 'admin',
  },
];

router.get('/', (req, res) => {
  // TODO: Update when database connected
  res.send(users);
});

router.post('/', (req, res) => {
  const user = req.body;
  // TODO: Update when database connected
  const newUser = { ...user, id: Math.random() };
  users.push(newUser);
  res.send(newUser);
});

module.exports = router;
