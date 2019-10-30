const router = require('express').Router();

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


// get a specific candidate
router.get('/candidate/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Candidate WHERE candidateId = ?';
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
