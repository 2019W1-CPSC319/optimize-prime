const router = require('express').Router();
const axios = require('axios');
const connection = require('../init/setupMySql');
const notAuthMiddleware = require('../utils/notAuthMiddleware');

// ***************** ROOMS Endpoints *******************

// get all rooms
router.get('/rooms', (req, res) => {
  const sql = 'SELECT * FROM Rooms';
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});


// add a new room, to the rooms table.
router.post('/room', (req, res) => {
  const room = req.body;
  // the room is active by default
  const status = 'A';
  const sql = 'INSERT INTO Rooms(name, seats, status) VALUES (?, ?, ?)';
  const sqlcmd = connection.format(sql, [room.name, room.seats, status]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// update the status of a room to disabled, in the rooms table
router.put('/room/:id', (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Rooms SET Status = 'D' WHERE id = ?";
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// ***************** CANDIDATES Endpoints *******************

// get all candidates
router.get('/candidates', async (req, res) => {
  const sql = "SELECT * FROM Candidate WHERE status <> 'D'";
  await connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});


// get a specific candidate
router.get('/candidate/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Candidate WHERE id = ?';
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});


// add a new user in either the candidates table or interview table based on the selected type
router.post('/newuser', (req, res) => {
  const user = req.body;
  const type = user.role;
  // status Active as default when adding
  const status = 'A';
  let sql = '';
  switch (type) {
    case 'candidate':
      sql = 'INSERT INTO Candidate(firstName, lastName, email, phone, status) VALUES (?, ?, ?, ?, ?)';
      break;
    case 'interviewer':
      sql = 'INSERT INTO Interviewer(firstName, lastName, email, phone, status) VALUES (?, ?, ?, ?, ?)';
      break;
    default: return;
  }
  const sqlcmd = connection.format(sql, [user.firstName, user.lastName, user.email, user.phone, status]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    const addedUser = { ...user, id: result.insertId };
    res.send(addedUser);
  });
});


// update the status of a candidate to disabled, in the candidate table
router.put('/candidate/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Candidate SET status = 'D' WHERE id = ?";
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// ***************** Candidate AVAILABILITY Endpoints *******************


// ***************** INTERVIEWERS Endpoints *******************

// get all interviewers
router.get('/interviewers', (req, res) => {
  const sql = 'SELECT * FROM Interviewer';
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// update the status of a interviewer to disabled, in the interviewer table
router.put('/interviewer/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Interviewer SET status = 'D' WHERE id = ?";
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
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
              address: 'candicepang@optimizeprime.onmicrosoft.com',
              name: 'Candice Pang',
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
