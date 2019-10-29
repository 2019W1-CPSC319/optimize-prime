const router = require('express').Router();
const connection = require('../init/setupMySql');

// ***************** ROOMS Endpoints *******************

// get all rooms
router.get('/rooms', (req, res) => {
  var sql = "SELECT * FROM Rooms";
  connection.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  })
});


// add a new room, to the rooms table.
router.post('/room', (req, res) => {
  const room = req.body;
  // the room is active by default
  const status = "A";
  var sql = "INSERT INTO Rooms(Name, Seats, Status) VALUES (?, ?, ?)";
  var sqlcmd = connection.format(sql, [room.name, room.seats, status]);
  connection.query(sqlcmd, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  })
});


// update the status of a room to disabled, in the rooms table
router.put('/room/:id', (req, res) => {
  const id = req.params.id;
  var sql = "UPDATE Rooms SET Status = 'D' WHERE roomID = ?";
  var sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  })
});

// ***************** CANDIDATES Endpoints *******************

// get all candidates 
router.get('/candidates', (req, res) => {
  var sql = "SELECT * FROM Candidate";
  connection.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  })
});


// get a specific candidate
router.get('/candidate/:id', (req, res) => {
  const id = req.params.id;
  var sql = "SELECT * FROM Candidate WHERE candidateId = ?";
  var sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  })
});


// add a new user in either the candidates table or interview table based on the selected type
router.post('/newuser', (req, res) => {
  const user = req.body;
  const type = user.role;
  // status Active as default when adding
  const status = "A";
  switch (type) {
    case "Candidate":
      var sql = "INSERT INTO Candidate(FirstName, LastName, Email, Phone, Status) VALUES (?, ?, ?, ?, ?)";
      break;
    case "Interviewer":
      var sql = "INSERT INTO Interviewer(FirstName, LastName, Email, Phone, Status) VALUES (?, ?, ?, ?, ?)";
      break;
  }
  var sqlcmd = connection.format(sql, [user.FirstName, user.LastName, user.Email, user.Phone, status]);
  connection.query(sqlcmd, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  })
});


// update the status of a candidate to disabled, in the candidate table
router.put('/candidate/:id', (req, res) => {
  const id = req.params.id;
  var sql = "UPDATE Candidate SET Status = 'D' WHERE candidateID = ?";
  var sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  })
});

// ***************** Candidate AVAILABILITY Endpoints *******************






// ***************** INTERVIEWERS Endpoints *******************

// get all interviewers 
router.get('/interviewers', (req, res) => {
  var sql = "SELECT * FROM Interviewer";
  connection.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  })
});

// update the status of a interviewer to disabled, in the interviewer table
router.put('/interviewer/:id', (req, res) => {
  const id = req.params.id;
  var sql = "UPDATE Interviewer SET Status = 'D' WHERE interviewerID = ?";
  var sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  })
});

module.exports = router
