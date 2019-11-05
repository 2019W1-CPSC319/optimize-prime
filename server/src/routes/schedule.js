const router = require('express').Router();
const connection = require('../init/setupMySql');

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
  const sql = 'INSERT INTO Rooms(Name, Seats, Status) VALUES (?, ?, ?)';
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
  const sql = "UPDATE Rooms SET Status = 'D' WHERE roomID = ?";
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
  const sql = 'SELECT * FROM Candidate';
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
      throw err;
    }
    // Just send the UUID and the first name
    res.send([{uuid: uuid, firstName: result[0].firstName}]);
  });
});

// get a specific candidate
router.get('/candidate/:uuid', (req, res) => {
  const { uuid } = req.params;
  const sql = 'SELECT * FROM Candidate WHERE uuid = ?';
  const sqlcmd = connection.format(sql, [uuid]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});


// add a new user in either the candidates table or interview table based on the selected type
router.post('/newuser', (req, res) => {
  const user = req.body
  const type = user.Role;
  // status Active as default when adding
  const status = 'A';
  let sql = '';
  switch (type) {
    case 'Candidate':
      sql = 'INSERT INTO Candidate(FirstName, LastName, Email, Phone, Status) VALUES (?, ?, ?, ?, ?)';
      break;
    case 'Interviewer':
      sql = 'INSERT INTO Interviewer(FirstName, LastName, Email, Phone, Status) VALUES (?, ?, ?, ?, ?)';
      break;
    default: return;
  }
  const sqlcmd = connection.format(sql, [user.FirstName, user.LastName, user.Email, user.Phone, status]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});


// update the status of a candidate to disabled, in the candidate table
router.put('/candidate/:id', (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Candidate SET Status = 'D' WHERE candidateID = ?";
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// ***************** Candidate AVAILABILITY Endpoints *******************

router.post('/availability', (req, res) => {
  const availability = req.body;

  const uuid = availability.uuid;
  const sqlSelect = 'SELECT * FROM Candidate WHERE uuid = ?';
  const sqlSelectcmd = connection.format(sqlSelect, [uuid]);
  let candidateId;
  connection.query(sqlSelectcmd, (err, result) => {
    if (err) {
      throw err;
    }
    candidateId = result[0].id;

    const sql = 'INSERT INTO candidateavailability(candidateId, startTime, endTime) VALUES (?, ?, ?)';
    const sqlcmd = connection.format(sql, [candidateId, availability.startTime, availability.endTime]);
    connection.query(sqlcmd, (err, result) => {
      if (err) {
        throw err;
      }
      res.send(result);
    });
  });
});


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
router.put('/interviewer/:id', (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Interviewer SET Status = 'D' WHERE interviewerID = ?";
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

module.exports = router;
