const router = require('express').Router();
const connection = require('../init/setupMySql');
const axios = require('axios');

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
router.put('/candidate/:id', (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Candidate SET Status = 'D' WHERE id = ?";
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
  const sql = "UPDATE Interviewer SET Status = 'D' WHERE id = ?";
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});







// ***************** Find Meeting Times  *********************** 

// find all the possible meeting times, given the following constraints/information: 
// attendess, timeConstraints, meetingDuration, locationConstraints

router.post('/meeting', async (req, res) => {

  // candidate ID       (will get from req.body)
  // const id = 1;

  // let startTime;
  // let endTime;

  // query the database to get the candidates availability (this will be useed as the time constratint)

  // const sql = 'SELECT * FROM Candidate c INNER JOIN CandidateAvailability a ON c.candidateID = a.candidateID WHERE id = ?';
  // const sqlcmd = connection.format(sql, [id]);
  // connection.query(sqlcmd, (err, result) => {
  //   if (err) {
  //     throw err;
  //   }

  //   // extract start and end time
  //   startTime = result.startTime;
  //   endTime = result.endTime;

  // });

  const attendees = [
    {
      Type: "Required",
      EmailAddress: {
        Address: "stefanmilosevic@optimizeprime.onmicrosoft.com"
      }
    }
  ]

  const startTime = "2019-11-02T22:10:26.589Z";
  const endTime = "2019-11-09T23:10:26.589Z";
  const timeZone = "Pacific Standard Time";

  const meetingDuration = "PT1H";

  // should add locationConstraint

  try {
    const response = await axios({
      method: 'post',
      url: 'https://graph.microsoft.com/v1.0/me/findmeetingtimes',
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
      data:
      {
        "attendees": attendees,
        "timeConstraint": {
          "timeslots": [
            {
              "start": {
                "dateTime": startTime,
                "timeZone": timeZone
              },
              "end": {
                "dateTime": endTime,
                "timeZone": timeZone
              }
            }
          ]
        },
        meetingDuration: meetingDuration
      }
    });
    // console.log(response);

    const meetingTimeSuggestions = response.data && response.data.meetingTimeSuggestions;

    if (meetingTimeSuggestions.length === 0) {
      res.send("No Meeting times are availble")
    }

    let possibleMeetings = [];
    for (meeting of meetingTimeSuggestions) {
      const meetingTimeSlot = meeting.meetingTimeSlot;
      const obj = {
        start: meetingTimeSlot.start,
        end: meetingTimeSlot.end
      }
      possibleMeetings.push(obj);
    }
    res.send(possibleMeetings);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
