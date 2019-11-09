const router = require('express').Router();
const axios = require('axios');
const connection = require('../init/setupMySql');
const notAuthMiddleware = require('../utils/notAuthMiddleware');

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

// ***************** CANDIDATE AVAILABILITY Endpoints *******************


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

// find all the possible meeting times, given the following constraints/information: 
// attendess, timeConstraints, meetingDuration, locationConstraints
router.post('/meeting', notAuthMiddleware, async (req, res) => {
  // const id = 1;
  // const meetingDuration = "PT1H";
  const { candidate, meetingDuration, required, optional } = req.body;
  // query the database to get the candidates availability (this will be useed as the time constratint)
  const sql = 'SELECT * FROM Candidate c INNER JOIN CandidateAvailability a ON c.id = a.candidateID WHERE c.email = ? ORDER BY a.id DESC';
  const sqlcmd = connection.format(sql, [candidate]);

  connection.query(sqlcmd, async (err, result) => {
    if (err) {
      throw err;
    }

    console.log(result);

    if (result.length === 0) {
      res.send("No candidate availability found");
    }
    try {
      const timeZone = "Pacific Standard Time";

      const timeConstraint = {
        activityDomain: 'work',
        timeSlots: result.map(time => ({
          start: {
            dateTime: time.startTime,
            timeZone,
          },
          end: {
            dateTime: time.endTime,
            timeZone,
          }
        }))
      };

      const requiredAttendees = required.map(interviewer => ({
        type: "Required",
        emailAddress: {
          address: interviewer.email
        }
      }));

      const optionalAttendees = optional.map(interviewer => ({
        type: "Optional",
        emailAddress: {
          address: interviewer.email
        }
      }));

      const attendees = requiredAttendees.concat(optionalAttendees);

      // should add locationConstraint

      console.log(JSON.stringify({
        attendees,
        timeConstraint,
        meetingDuration,
        isOrganizerOptional: true,
      }));

      const response = await axios({
        method: 'post',
        url: 'https://graph.microsoft.com/v1.0/me/findmeetingtimes',
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
        },
        data: {
          attendees,
          timeConstraint,
          meetingDuration,
          isOrganizerOptional: true,
        }
      });

      const meetingTimeSuggestions = response.data && response.data.meetingTimeSuggestions;

      console.log(meetingTimeSuggestions);

      if (meetingTimeSuggestions.length === 0) {
        res.send([]);
      } else {
        let possibleMeetings = [];
        for (meeting of meetingTimeSuggestions) {
          for (room of meeting.locations) {
            possibleMeetings.push({
              start: meeting.meetingTimeSlot.start,
              end: meeting.meetingTimeSlot.end,
              room,
            });
          }
        }
        res.send(possibleMeetings);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = router;
