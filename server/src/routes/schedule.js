const router = require('express').Router();
const connection = require('../init/setupMySql');
const notAuthMiddleware = require('../utils/notAuthMiddleware');
const uuidv1 = require('uuid/v1');
const axios = require('axios');


// ***************** ROOMS Endpoints *******************

// get all rooms
router.get('/rooms', (req, res) => {
  const sql = 'SELECT * FROM Rooms WHERE status="A"';
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// add a new room, to the rooms table.
router.post('/room', async (req, res) => {
  const room = req.body;
  let sql = 'INSERT INTO Rooms(name, seats, status) VALUES (?, ?, ?)';
  let sqlcmd = connection.format(sql, [room.name, room.seats, 'A']);
  connection.query(sqlcmd, (err, addedRoom) => {
    if (err) {
      throw err;
    }
    sql = 'SELECT * FROM Rooms WHERE id=?';
    sqlcmd = connection.format(sql, [addedRoom.insertId]);
    connection.query(sqlcmd, (err, savedRoom) => {
      if (err) {
        throw err;
      }
      // savedRoom is the room that has just been added which consists of id, name, seats, and status attributes
      res.send(savedRoom[0]);
    });
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

/**
 * Get a candidate's firstname, for the candidate availabilty page.
 *
 * This should be the only method that can be used without authentication.
 */
router.get('/candidate/name/:uuid', (req, res) => {
  const { uuid } = req.params;
  const sql = 'SELECT firstName FROM Candidate WHERE uuid = ?';
  const sqlcmd = connection.format(sql, [uuid]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server Error.' });
    }
    if (result.length === 0) {
      return res.status(204).send({ message: 'No candidate' });
    }
    // Just send the UUID and the first name
    return res.send([{ uuid, firstName: result[0].firstName }]);
  });
});

// get a specific candidate
router.get('/candidate/:uuid', notAuthMiddleware, (req, res) => {
  const { uuid } = req.params;
  const sql = 'SELECT * FROM Candidate WHERE uuid = ?';
  const sqlcmd = connection.format(sql, [uuid]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server error.' });
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
  const uuid = uuidv1();
  let sql = '';
  switch (type) {
    case 'candidate':
      sql = 'INSERT INTO Candidate(firstName, lastName, email, phone, status, uuid) VALUES (?, ?, ?, ?, ?, ?)';     
      break;
    case 'interviewer':
      sql = 'INSERT INTO Interviewer(firstName, lastName, email, phone, status) VALUES (?, ?, ?, ?, ?)';
      break;
    default: return;
  }
  const sqlcmd = connection.format(sql, [user.firstName, user.lastName, user.email, user.phone, status, uuid]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    const addedUser = { ...user, id: result.insertId };
    res.send(addedUser);
    
    // send an unique link to the candidate to fill out their availability
    if (type === "candidate") {
      try {
        const subject = "Availability"
        const body = "Hi " + user.firstName + "," + "\nPlease fill out your availability by going here: " + "https://optimize-prime.herokuapp.com/candidate/" + uuid;
        const response = axios({
          method: 'post',
          url: 'https://graph.microsoft.com/v1.0/me/sendMail',
          headers: {
            Authorization: `Bearer ${req.user.accessToken}`,
          },
          data: {
            message: {
              subject: subject,
              body: {
                contentType: 'text',
                content: body,
              },
              toRecipients: [
                {
                  emailAddress: {
                    address: user.email,
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
    }
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

// ***************** CANDIDATE AVAILABILITY Endpoints *******************

router.post('/availability', (req, res) => {
  try {
    const { availability, uuid } = req.body;
    const sqlSelect = 'SELECT * FROM Candidate WHERE uuid = ?';
    const sqlSelectcmd = connection.format(sqlSelect, [uuid]);
    let candidateId;
    connection.query(sqlSelectcmd, (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Internal Server error' });
      }
      candidateId = result[0].id;

      const sql = 'INSERT INTO candidateavailability(candidateId, startTime, endTime) VALUES ?';
      const values = [availability.map((time) => [candidateId, time.startTime, time.endTime])];
      const sqlcmd = connection.format(sql, values);
      connection.query(sqlcmd, (err, result) => {
        if (err) {
          return res.status(500).send({ message: 'Internal Server error' });
        }
        res.send(result);
      });
    });
  } catch (error) {
    res.status(error.statusCode).send({ message: error.message });
  }
});


// ***************** INTERVIEWERS Endpoints *****************************

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

module.exports = router;
