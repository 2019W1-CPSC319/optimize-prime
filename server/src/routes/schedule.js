const router = require('express').Router();
const uuidv1 = require('uuid/v1');
const axios = require('axios');
const connection = require('../init/setupMySql');
const notAuthMiddleware = require('../utils/notAuthMiddleware');
const scheduler = require('../scheduling/scheduler')

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
  let sql = 'INSERT INTO Rooms(name, seats, status, email) VALUES (?, ?, ?, ?)';
  let sqlcmd = connection.format(sql, [room.name, room.seats, 'A', room.email]);
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
  console.log(req.user);
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
  });
});


// edit the interviewer or candidate user information
router.put('/edituser', (req, res) => {
  const user = req.body;
  const type = user.role;
  let sql = '';
  switch (type) {
    case 'candidate':
      sql = 'UPDATE Candidate SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE id = ?';
      break;
    case 'interviewer':
      sql = 'UPDATE Interviewer SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE id = ?';
      break;
    default: return;
  }
  const sqlcmd = connection.format(sql, [user.firstName, user.lastName, user.email, user.phone, user.id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
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

router.post('/sendEmail', (req, res) => {
  const { firstName, email } = req.body;
  const sqlcmd = connection.format("SELECT uuid from Candidate WHERE Email = ? AND status = 'A'", [email]);
  connection.query(sqlcmd, async (err, result) => {
    if (err) {
      throw err;
    }

    const uuid = result[0].uuid;

    try {
      const subject = "Availability";
      const body = "Hi " + firstName + "," + "\nPlease fill out your availability by going here: " + "https://optimize-prime.herokuapp.com/candidate?key=" + uuid;
      const response = await axios({
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
                  address: email,
                },
              },
            ],
          },
        },
      });
      res.send(response.data);
    } catch (error) {
      res.status(500).send({ message: 'Internal server Error.' });
    }
  });
})

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
  const sql = "SELECT * FROM Interviewer WHERE status <> 'D'";
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

router.post('/allmeetings', notAuthMiddleware, async (req, res) => {
  const { candidate, interviews } = req.body;
  let result = await scheduler.findTimes(interviews, candidate, req.user.accessToken);
  res.send(result);
});

// find all the possible meeting times, given the following constraints/information:
// attendess, timeConstraints, meetingDuration, locationConstraints
router.post('/meeting', notAuthMiddleware, async (req, res) => {
  const { candidate, meetingDuration, required, optional } = req.body;
  const sql = "SELECT * FROM Candidate c INNER JOIN CandidateAvailability a ON c.id = a.candidateID WHERE c.email = ? AND c.status = 'A' ORDER BY a.id DESC";
  const sqlcmd = connection.format(sql, [candidate]);

  connection.query(sqlcmd, async (err, result) => {
    if (err) {
      throw err;
    }

    console.log(result);

    if (result.length === 0) {
      res.send("No candidate availability found");
    } else {
      try {
        const timeZone = "Pacific Standard Time";

        const timeConstraint = {
          activityDomain: "work",
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
          type: "required",
          emailAddress: {
            address: interviewer.email
          }
        }));

        const optionalAttendees = optional.map(interviewer => ({
          type: "optional",
          emailAddress: {
            address: interviewer.email
          }
        }));

        const attendees = requiredAttendees.concat(optionalAttendees);

        const sqlcmd = 'SELECT * FROM Rooms WHERE status="A"';
        connection.query(sqlcmd, async (err, result) => {
          if (err) {
            throw err;
          }
          let locations = [{}];
          if (result.length > 0) {
            locations = result.map(room => ({
              displayName: room.name,
              locationEmailAddress: room.email
            }))
          }

          const data = {
            attendees,
            timeConstraint,
            maxCandidates: 30,
            meetingDuration,
            locationConstraint: {
              isRequired: "true",
              suggestLocation: "false",
              locations: locations
            }
          }

          console.log(JSON.stringify(data));

          const response = await axios({
            method: 'post',
            url: 'https://graph.microsoft.com/v1.0/me/findmeetingtimes',
            headers: {
              Authorization: `Bearer ${req.user.accessToken}`,
            },
            data
          });

          const meetingTimeSuggestions = (response.data && response.data.meetingTimeSuggestions) || [];

          console.log(JSON.stringify(meetingTimeSuggestions));

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
                  interviewers: meeting.attendeeAvailability.filter(attendee => attendee.availability === "free"),
                });
              }
            }
            res.send(possibleMeetings);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
});

// ************* Send out a meeting invite to the attendees and book the room for the duration of the interview **************************

router.post('/event', notAuthMiddleware, async (req, res) => {
  try {
    const { candidate, date, required, optional, room } = req.body;
    const subject = "Interview with " + candidate.firstName + ' ' + candidate.lastName;
    const content = "Please confirm if you are available during this time."

    // create candidate as an attendee
    const candidateAttendee = [
      {
        type: "required",
        emailAddress: {
          address: candidate.email
        }
      }
    ];

    // required attendees
    const requiredAttendees = required.map(interviewer => ({
      type: "required",
      emailAddress: {
        address: interviewer
      }
    }));

    // optional attendees
    const optionalAttendees = optional.map(interviewer => ({
      type: "optional",
      emailAddress: {
        address: interviewer
      }
    }));

    const roomAttendee = {
      type: "required",
      emailAddress: {
        address: room.email
      }
    };

    // combine all the attendees aswell as the candidate
    const interviewerAttendees = requiredAttendees.concat(optionalAttendees);
    const attendees = interviewerAttendees.concat(candidateAttendee).concat(roomAttendee);

    const response = await axios({
      method: 'post',
      url: 'https://graph.microsoft.com/v1.0/me/events',
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
      data: {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: content,
        },
        start: date.startTime,
        end: date.endTime,
        location: {
          displayName: room.name,
          locationEmailAddress: room.email,
        },
        attendees: attendees
      },
    });

    // insert the scheduled interview in the candidate table
    const sql = "SELECT * FROM Rooms WHERE name = ? AND status = 'A'";
    const sqlcmd = connection.format(sql, [room.name]);

    connection.query(sqlcmd, (err, result) => {
      if (err) {
        throw err;
      }

      // get roomId
      const roomId = result[0].id;
      const sql = 'INSERT INTO ScheduledInterview(CandidateID, StartTime, EndTime, roomId) VALUES (?, STR_TO_DATE(?, ?), STR_TO_DATE(?, ?), ?)'
      const sqlcmd = connection.format(sql, [candidate.id, date.startTime.dateTime, '%Y-%m-%dT%H:%i:%s.%fZ', date.endTime.dateTime, '%Y-%m-%dT%H:%i:%s.%fZ', roomId]);

      connection.query(sqlcmd, (err, result) => {
        if (err) {
          throw err;
        }
      });
    });
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

// ************* Get meeting rooms from outlook *************** //

router.get('/outlook/rooms', notAuthMiddleware, async (req, res) => {
  const response = await axios({
    method: 'get',
    url: 'https://graph.microsoft.com/beta/me/findRooms',
    headers: {
      Authorization: `Bearer ${req.user.accessToken}`,
    }
  });
  res.send(response.data && response.data.value);
});

// **************************** Get all scheduled interviews ************************************ //

router.get('/interviews', notAuthMiddleware, (req, res) => {
  const currDate = new Date();
  const sql = 'SELECT * FROM Candidate c INNER JOIN ScheduledInterview s ON c.id = s.candidateId INNER JOIN Rooms r ON s.roomId = r.id WHERE startTime >= ?';
  const sqlcmd = connection.format(sql, [currDate]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

module.exports = router;
