const router = require('express').Router();
const uuidv1 = require('uuid/v1');
const axios = require('axios');
const moment = require('moment');
const connection = require('../init/setupMySql');
const notAuthMiddleware = require('../utils/notAuthMiddleware');
const scheduler = require('../scheduling/scheduler');

// get all rooms
router.get('/rooms', notAuthMiddleware, (req, res) => {
  const sql = 'SELECT * FROM Rooms WHERE status="A"';
  connection.query(sql, (err, result) => {
    if (err) {
      return result.status(500).send({ message: 'Internal server Error.' });
    }
    res.send(result);
  });
});

// add a new room, to the rooms table.
router.post('/room', notAuthMiddleware, async (req, res) => {
  const room = req.body;
  let sql = 'INSERT INTO Rooms(name, seats, status, email) VALUES (?, ?, ?, ?)';
  let sqlcmd = connection.format(sql, [room.name, room.seats, 'A', room.email]);
  connection.query(sqlcmd, (err, addedRoom) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server Error.' });
    }
    sql = 'SELECT * FROM Rooms WHERE id=?';
    sqlcmd = connection.format(sql, [addedRoom.insertId]);
    connection.query(sqlcmd, (err, savedRoom) => {
      if (err) {
        return res.status(500).send({ message: 'Internal server Error.' });
      }
      // savedRoom is the room that has just been added which consists of id, name, seats, and status attributes
      res.send(savedRoom[0]);
    });
  });
});

// update the status of a room to disabled, in the rooms table
router.put('/room/:id', notAuthMiddleware, (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Rooms SET Status = 'D' WHERE id = ?";
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server Error.' });
    }
    res.send(result);
  });
});

// get all candidates
router.get('/candidates', notAuthMiddleware, async (req, res) => {
  const sql = "SELECT * FROM Candidate WHERE status <> 'D'";
  await connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server Error.' });
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
router.get('/candidate/:uuid', (req, res) => {
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
router.post('/newcandidate', notAuthMiddleware, (req, res) => {
  try {
    const user = req.body;
    const status = 'A';
    const uuid = uuidv1();
    const sql = 'INSERT INTO Candidate(firstName, lastName, email, phone, status, uuid, submittedAvailability) VALUES (?, ?, ?, ?, ?, ?, "F")';
    const sqlcmd = connection.format(sql, [user.firstName, user.lastName, user.email, user.phone, status, uuid]);
    connection.query(sqlcmd, (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Internal Server error' });
      }
      const addedUser = { ...user, id: result.insertId };
      res.send(addedUser);
    });
  } catch (error) {
    return res.status(error.statusCode).send({ message: error.message });
  }
});

// edit the administrator or candidate user information
router.put('/edituser', notAuthMiddleware, (req, res) => {
  const user = req.body;
  const type = user.role;

  let sql = '';
  switch (type) {
    case 'candidate':
      sql = 'UPDATE Candidate SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE id = ?';
      break;
    case 'administrator':
      sql = 'UPDATE AdminUsers SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE id = ?';
      break;
    default: return;
  }

  let sqlcmd = connection.format(sql, [user.firstName, user.lastName, user.email, user.phone, user.id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      return result.status(500).send({ message: 'Internal server Error.' });
    }
    switch (type) {
      case 'candidate':
        sql = 'SELECT * FROM Candidate WHERE id = ?';
        break;
      case 'administrator':
        sql = 'SELECT * FROM AdminUsers WHERE id = ?';
        break;
      default: return;
    }

    sqlcmd = connection.format(sql, [user.id]);
    connection.query(sqlcmd, (err, updatedUser) => {
      if (err) {
        return res.status(500).send({ message: 'Internal server Error.' });
      }

      res.send(updatedUser[0]);
    });
  });
});

// update the status of a candidate to disabled, in the candidate table
router.put('/candidate/delete/:id', notAuthMiddleware, (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Candidate SET status = 'D' WHERE id = ?";
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server Error.' });
    }
    res.send(result);
  });
});

router.post('/sendEmail', notAuthMiddleware, (req, res) => {
  const { firstName, email } = req.body;
  const sqlcmd = connection.format("SELECT uuid from Candidate WHERE Email = ? AND status = 'A'", [email]);
  connection.query(sqlcmd, async (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server Error.' });
    }

    const { uuid } = result[0];

    // get email template config
    const sqlcmd = 'SELECT * FROM EmailConfig';
    connection.query(sqlcmd, async (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Internal Server error' });
      }

      const { subject, body, signature } = result[0];

      try {
        // const subject = 'Availability';
        const content = `Hi ${firstName},\n\nPlease fill out your availability by going here: https://optimize-prime.herokuapp.com/candidate?key=${uuid}\n\n${body}\n\n${signature}`;
        const response = await axios({
          method: 'post',
          url: 'https://graph.microsoft.com/v1.0/me/sendMail',
          headers: {
            Authorization: `Bearer ${req.user.accessToken}`,
          },
          data: {
            message: {
              subject,
              body: {
                contentType: 'text',
                content,
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
  });
});

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

      let sql = 'INSERT INTO candidateavailability(candidateId, startTime, endTime) VALUES ?';
      const values = [availability.map((time) => [candidateId, time.startTime, time.endTime])];
      let sqlcmd = connection.format(sql, values);
      connection.query(sqlcmd, (err, result) => {
        if (err) {
          return res.status(500).send({ message: 'Internal Server error' });
        }

        sql = "UPDATE Candidate SET submittedAvailability = 'T' WHERE id = ?";
        sqlcmd = connection.format(sql, [candidateId]);
        connection.query(sqlcmd, (err, result) => {
          if (err) {
            return res.status(500).send({ message: 'Internal Server error' });
          }
        });
        res.send(result);
      });
    });
  } catch (error) {
    res.status(error.statusCode).send({ message: error.message });
  }
});

router.post('/allmeetings', notAuthMiddleware, async (req, res) => {
  const { candidate, interviews } = req.body;
  const result = await scheduler.findTimes(interviews, candidate, req.user.accessToken);
  res.send(result);
});

// find all the possible meeting times, given the following constraints/information:
// attendess, timeConstraints, meetingDuration, locationConstraints
router.post('/meeting', notAuthMiddleware, async (req, res) => {
  const {
    candidate, meetingDuration, required, optional,
  } = req.body;
  const sql = "SELECT * FROM Candidate c INNER JOIN CandidateAvailability a ON c.id = a.candidateID WHERE c.email = ? AND c.status = 'A' ORDER BY a.id DESC";
  const getCandidateAvailabilityCmd = connection.format(sql, [candidate]);

  connection.query(getCandidateAvailabilityCmd, async (candidateAvailabilityError, candidateAvailability) => {
    if (candidateAvailabilityError) {
      res.status(500).send(candidateAvailabilityError);
    }

    if (candidateAvailability.length === 0) {
      res.send('No candidate availability found');
    } else {
      try {
        const timeZone = 'Pacific Standard Time';

        const timeConstraint = {
          activityDomain: 'work',
          timeSlots: candidateAvailability.map((time) => ({
            start: {
              dateTime: time.startTime,
              timeZone,
            },
            end: {
              dateTime: time.endTime,
              timeZone,
            },
          })),
        };

        const requiredAttendees = required.map((interviewer) => ({
          type: 'required',
          emailAddress: {
            address: interviewer,
          },
        }));

        const optionalAttendees = optional.map((interviewer) => ({
          type: 'optional',
          emailAddress: {
            address: interviewer,
          },
        }));

        const attendees = requiredAttendees.concat(optionalAttendees);

        const getRoomsCmd = 'SELECT * FROM Rooms WHERE status="A"';
        connection.query(getRoomsCmd, async (availableRoomsError, availableRooms) => {
          if (availableRoomsError) {
            res.status(500).send(availableRoomsError);
          }
          let locations = [{}];
          if (availableRooms.length > 0) {
            locations = availableRooms.map((room) => ({
              displayName: room.name,
              locationEmailAddress: room.email,
            }));
          }

          const possibleMeetings = [];

          // Need to loop through each availability block because if the duration of time
          // constraint blocks is equal to the specified meeting duration, only the earliest
          // meeting suggestion will be returned (i.e. not the full set of solution)
          const meetingSuggestionPromises = timeConstraint.timeSlots.map(async (block) => {
            const formattedTimeBlock = {
              activityDomain: 'work',
              timeSlots: [
                {
                  start: block.start,
                  end: block.end,
                },
              ],
            };

            const data = {
              attendees,
              timeConstraint: formattedTimeBlock,
              maxCandidates: 30,
              meetingDuration,
              locationConstraint: {
                isRequired: 'true',
                suggestLocation: 'false',
                locations,
              },
            };

            const response = await axios({
              method: 'post',
              url: 'https://graph.microsoft.com/v1.0/me/findmeetingtimes',
              headers: {
                Authorization: `Bearer ${req.user.accessToken}`,
                Prefer: `outlook.timezone="${timeZone}"`,
              },
              data,
            });

            const meetingTimeSuggestions = (response.data && response.data.meetingTimeSuggestions) || [];

            if (meetingTimeSuggestions.length > 0) {
              meetingTimeSuggestions.forEach((meeting) => {
                meeting.locations.forEach((room) => {
                  possibleMeetings.push({
                    start: meeting.meetingTimeSlot.start,
                    end: meeting.meetingTimeSlot.end,
                    room,
                    interviewers: meeting.attendeeAvailability.filter((attendee) => attendee.availability === 'free'),
                  });
                });
              });
            }
          });
          await Promise.all(meetingSuggestionPromises);

          res.send(possibleMeetings.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime)));
        });
      } catch (error) {
        res.status(error.statusCode).send({ message: error.message });
      }
    }
  });
});

router.post('/event', notAuthMiddleware, async (req, res) => {
  try {
    const {
      candidate, date, required, optional, room,
    } = req.body;
    const subject = `Interview with ${candidate.firstName} ${candidate.lastName}`;
    const content = 'Please confirm if you are available during this time.';
    const timeZone = 'Pacific Standard Time';
    // create candidate as an attendee
    const candidateAttendee = [
      {
        type: 'required',
        emailAddress: {
          address: candidate.email,
        },
      },
    ];
    // required attendees
    const requiredAttendees = required.map((interviewer) => ({
      type: 'required',
      emailAddress: {
        address: interviewer,
      },
    }));
    // optional attendees
    const optionalAttendees = optional.map((interviewer) => ({
      type: 'optional',
      emailAddress: {
        address: interviewer,
      },
    }));
    const roomAttendee = {
      type: 'required',
      emailAddress: {
        address: room.email,
      },
    };
    // combine all the attendees aswell as the candidate
    const interviewerAttendees = requiredAttendees.concat(optionalAttendees);
    const attendees = interviewerAttendees.concat(candidateAttendee).concat(roomAttendee);
    const response = await axios({
      method: 'post',
      url: 'https://graph.microsoft.com/v1.0/me/events',
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
        Prefer: `outlook.timezone="${timeZone}"`,
      },
      data: {
        subject,
        body: {
          contentType: 'HTML',
          content,
        },
        start: date.startTime,
        end: date.endTime,
        location: {
          displayName: room.name,
          locationEmailAddress: room.email,
        },
        attendees,
      },
    });

    // insert the scheduled interview in the candidate table
    let sql = "SELECT * FROM Rooms WHERE name = ? AND status = 'A'";
    let sqlcmd = connection.format(sql, [room.name]);
    connection.query(sqlcmd, (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Internal server error.' });
      }

      // get roomId
      const newRoomID = result[0].id;
      const outlookID = response.data.id;
      sql = 'INSERT INTO ScheduledInterview(CandidateID, StartTime, EndTime, RoomID, OutlookID) VALUES (?, STR_TO_DATE(?, ?), STR_TO_DATE(?, ?), ?, ?)';
      sqlcmd = connection.format(sql, [candidate.id, moment(date.startTime.dateTime).format(), '%Y-%m-%dT%H:%i:%s-08:00', moment(date.endTime.dateTime).format(), '%Y-%m-%dT%H:%i:%s-08:00', newRoomID, outlookID]);
      connection.query(sqlcmd, (err, scheduledInterview) => {
        if (err) {
          return res.status(500).send({ message: 'Internal server error.' });
        }
        sql = 'SELECT s.id, startTime, endTime, c.id AS candidateId, firstName, lastName, r.id AS roomId, name, seats FROM Candidate c INNER JOIN ScheduledInterview s ON c.id = s.candidateId INNER JOIN Rooms r ON s.roomId = r.id WHERE s.id = ?';
        sqlcmd = connection.format(sql, [scheduledInterview.insertId]);
        connection.query(sqlcmd, (err, newScheduledInterview) => {
          if (err) {
            return res.status(500).send({ message: 'Internal server error.' });
          }
          const {
            candidateId,
            firstName,
            lastName,
            roomId,
            name,
            seats,
            ...interviewDetails
          } = newScheduledInterview[0];
          const formattedInterview = {
            ...interviewDetails,
            candidate: {
              id: candidateId,
              firstName,
              lastName,
            },
            room: {
              id: roomId,
              name,
              seats,
            },
          };
          res.send(formattedInterview);

          sql = "UPDATE Candidate SET submittedAvailability = 'F' WHERE id = ?";
          sqlcmd = connection.format(sql, [candidate.id]);
          connection.query(sqlcmd, (err, newScheduledInterview) => {
            if (err) {
              return res.status(500).send({ message: 'Internal server error.' });
            }
          });

          sql = 'DELETE FROM Candidateavailability WHERE candidateId = ?';
          sqlcmd = connection.format(sql, [candidate.id]);
          connection.query(sqlcmd, (err, result) => {
            if (err) {
              return res.status(500).send({ message: 'Internal Server error' });
            }
          });
        });
      });
    });
  } catch (error) {
    res.status(error.response.status).send(error.message);
  }
});

router.delete('/events/:id', notAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const getID = 'SELECT outlookID FROM ScheduledInterview WHERE id=?';
    const getIDcmd = connection.format(getID, id);
    connection.query(getIDcmd, async (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Internal Server error' });
      }
      const timeZone = 'Pacific Standard Time';
      try {
        const response = await axios.delete(
          `https://graph.microsoft.com/v1.0/me/events/${result[0].outlookID}`,
          {
            headers: {
              Authorization: `Bearer ${req.user.accessToken}`,
              Prefer: `outlook.timezone="${timeZone}"`,
            },
          }
        );
        const hasUpcomingEvents = 'SELECT * FROM ScheduledInterview s1, (SELECT candidateID FROM ScheduledInterview WHERE id=?) s2 WHERE s1.candidateID=s2.candidateID';
        const hasUpcomingEventscmd = connection.format(hasUpcomingEvents, id);
        connection.query(hasUpcomingEventscmd, async (err, result) => {
          if (err) {
            return res.status(500).send({ message: 'Internal Server error' });
          }
          if (result.length === 0) {
            const updateStatus = "UPDATE Candidate SET submittedAvailability='F' WHERE id IN (SELECT candidateID FROM ScheduledInterview WHERE id=?)";
            const updateStatuscmd = connection.format(updateStatus, id);
            await connection.query(updateStatuscmd);
          }
          const deleteEvent = 'DELETE FROM ScheduledInterview WHERE id=?';
          const deleteEventcmd = connection.format(deleteEvent, id);
          connection.query(deleteEventcmd, async (err, result) => {
            if (err) {
              return res.status(500).send({ message: 'Internal Server error' });
            }
            res.status(response.status).send({ message: response.statusText });
          });
        });
      } catch (error) {
        res.status(error.statusCode).send({ message: error.message });
      }
    });
  } catch (error) {
    res.status(error.statusCode).send({ message: error.message });
  }
});

router.get('/administrators', notAuthMiddleware, async (req, res) => {
  try {
    const sql = 'SELECT * FROM AdminUsers';
    const sqlcmd = connection.format(sql);
    connection.query(sqlcmd, async (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Internal Server error' });
      }
      res.send(result);
    });
  } catch (error) {
    res.status(error.statusCode).send({ message: error.message });
  }
});

// ************* Get meeting rooms from outlook *************** //

router.get('/outlook/rooms', notAuthMiddleware, async (req, res) => {
  const response = await axios({
    method: 'get',
    url: 'https://graph.microsoft.com/beta/me/findRooms',
    headers: {
      Authorization: `Bearer ${req.user.accessToken}`,
    },
  });
  res.send(response.data && response.data.value);
});

router.get('/outlook/users', notAuthMiddleware, async (req, res) => {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://graph.microsoft.com/v1.0/users',
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    });
    res.send(
      response.data.value
        .filter((user) => user.givenName !== null)
        .map((user) => ({
          firstName: user.givenName,
          lastName: user.surname,
          email: user.mail,
        })),
    );
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }
});

// **************************** Get all scheduled interviews ************************************ //

// get a list of interviews
router.get('/interviews', notAuthMiddleware, (req, res) => {
  const currDate = new Date();
  const sql = 'SELECT s.id, startTime, endTime, c.id AS candidateId, firstName, lastName, r.id AS roomId, name, seats FROM Candidate c INNER JOIN ScheduledInterview s ON c.id = s.candidateId INNER JOIN Rooms r ON s.roomId = r.id WHERE startTime >= ? ORDER BY startTime';
  const sqlcmd = connection.format(sql, [currDate]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server error' });
    }
    const formattedInterviews = result.map((interview) => {
      const {
        candidateId,
        firstName,
        lastName,
        roomId,
        name,
        seats,
        ...interviewDetails
      } = interview;

      return {
        ...interviewDetails,
        candidate: {
          id: candidateId,
          firstName,
          lastName,
        },
        room: {
          id: roomId,
          name,
          seats,
        },
      };
    });
    res.send(formattedInterviews);
  });
});

// ************************** Admin endpoints *********************** //
router.post('/newadministrator', notAuthMiddleware, async (req, res) => {
  try {
    // check if user is not part of the org.
    const user = req.body;
    const response = await axios({
      url: `https://graph.microsoft.com/v1.0/users?$filter=startswith(mail,'${user.email}')`,
      headers: {
        Authorization: req.user.accessToken,
      },
    });
    if (response.data.value.length === 0) {
      return res.status(400).send({ message: 'You have tried to create an admin that is not part of the organization.' });
    }
    const sqlQuery = 'SELECT email FROM adminUsers WHERE email= ?';
    const sqlcmd = connection.format(sqlQuery, [user.email]);
    await connection.query(sqlcmd, (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Internal server error' });
      }
      if (result.length > 0) {
        return res.status(400).send({ message: 'User is already an admin' });
      }
      const sql = 'INSERT INTO adminUsers(firstName, lastName, email, phone) VALUES(?, ?, ?, ?)';
      const sqlcmd2 = connection.format(sql, [user.firstName, user.lastName, user.email, user.phone]);
      connection.query(sqlcmd2, (error, r) => {
        if (error) {
          return res.status(500).send({ message: 'Internal Server error.' });
        }
        const addedUser = { ...user, id: r.insertId };
        return res.send(addedUser);
      });
    });
  } catch (error) {
    res.status(error.statusCode).send({ message: error.message });
  }
});

router.put('/administrator/delete/:id', notAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM adminUsers WHERE id = ?';
  const sqlcmd = connection.format(sql, [id]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server error.' });
    }
    res.send(result);
  });
});


// get email config
router.get('/emailconfig', notAuthMiddleware, (req, res) => {
  const sql = 'SELECT * FROM EmailConfig';
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server error.' });
    }
    res.send(result);
  });
});

// update email template config
router.put('/emailconfig', notAuthMiddleware, (req, res) => {
  const { subject, body, signature } = req.body;
  const sql = 'UPDATE EmailConfig SET subject = ?, body = ?, signature = ? WHERE id = 1';
  const sqlcmd = connection.format(sql, [subject, body, signature]);
  connection.query(sqlcmd, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server error.' });
    }
    res.send(result);
  });
});

module.exports = router;
