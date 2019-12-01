// Imports
const moment = require('moment');
const axios = require('axios');
const db = require('../init/setupMySql');

// File Constants
const DEBUG = false;

const GET_AVAILABILITY_SQL = 'SELECT * FROM Candidate c INNER JOIN CandidateAvailability a ON c.id = a.candidateID WHERE c.email = ? ORDER BY a.id DESC';
const TIME_INTERVAL = 15;

class Interview {
  constructor(required, optional, room, duration) {
    this.required = required;
    this.optional = optional;
    this.room = room;
    this.duration = duration;
  }
}

async function findTimes(interviews, candidateEmail, token) {
  const algorithmStartTime = new Date().getTime();

  const rawAvail = await getAvailability(candidateEmail);

  // Tidy up the availability to make it easier to use
  const availability = [];
  rawAvail.forEach((element) => {
    availability.push({
      start: moment(element.startTime),
      end: moment(element.endTime),
    });
  });
  DEBUG && console.log('candidate availability:');
  DEBUG && console.log(availability);

  const rooms = await getRoomList();
  DEBUG && console.log('Rooms:');
  DEBUG && console.log(rooms);

  /**
     * ** ASSUMPTION **
     * This makes the assumption that all interviews have unique required
     * interviewers, otherwise the algorithm will waste time getting the busy
     * times of these duplicate required interviewers more than once
     */

  let totalTime = 0;
  let allRequired = [];
  interviews.forEach((interview) => {
    totalTime += interview.duration;
    allRequired = allRequired.concat(interview.required);
  });
  DEBUG && console.log(`Total interview time = ${String(totalTime)}`);
  DEBUG && console.log(`All required interviewers = ${String(allRequired)}`);

  let optimalSchedules = [];
  let best = Number.MAX_VALUE;
  let schedulingTime = 0;
  let graphTime = 0;

  for (block = 0; block < availability.length; block++) {
    const { start } = availability[block]; const
      { end } = availability[block];

    if (new moment().diff(start) > 0) {
      // If this interview is before now
      console.log('Skipping availability block as it started in the past');
      continue;
    }

    // Make sure that the block is longer than the duration of all interviews
    const blockDuration = moment.duration(end.diff(start)).asMinutes();
    if (totalTime > blockDuration) {
      DEBUG && console.log(`Block ${String(block) } is too short (${String(blockDuration) } mins)`);
      continue;
    }

    // Get Availabilities of all interviewers for this block
    let beforeGraph = new Date().getTime();
    const avails = await getInterviewerAvailability(allRequired, start, end, token);
    graphTime += new Date().getTime() - beforeGraph;

    DEBUG && console.log('Availabilities: ');
    DEBUG && console.log(avails);

    // Let this one go async as we don't need until later
    let roomAvail = getInterviewerAvailability(rooms.map((x) => x.locationEmailAddress), start, end, token);

    const beforeScheduling = new Date().getTime();
    const schedules = arrangeInterviews(interviews, avails, best, totalTime / TIME_INTERVAL);
    schedulingTime += new Date().getTime() - beforeScheduling;

    // godlike one-liner to remove duplicates
    schedules.sequence = Array.from(new Set(schedules.sequence.map(JSON.stringify))).map(JSON.parse);

    // Make into proper interview sequence objects
    schedules.sequence = schedules.sequence.map(((x) => parseNumArrayToTimes(interviews, x, start)));
    // Add rooms
    beforeGraph = new Date().getTime();
    roomAvail = await roomAvail;
    graphTime += new Date().getTime() - beforeGraph;

    schedules.sequence = schedules.sequence.map(((x) => assignRooms(rooms, roomAvail, x, start)));


    if (DEBUG) {
      console.log(`${String(schedules.sequence.length)} Schedules for ${String(start)}:`);
      for (let x = 0; x < schedules.sequence.length; x++) {
        console.log(String(schedules.sequence[x]));
      }
    }

    if (schedules.best < best) {
      best = schedules.best;
      optimalSchedules = schedules.sequence;
    } else if (schedules.best == best) {
      optimalSchedules = optimalSchedules.concat(schedules.sequence);
    }
  }
  // Kept even when debug disabled
  const algorithmRunTime = new Date().getTime() - algorithmStartTime;
  console.log(`Found ${
    String(optimalSchedules.length)
  } optimal interview schedules in ${
    String(algorithmRunTime)
  }ms.`);
  console.log(`Scheduling took ${String(schedulingTime) }ms in total`);
  console.log(`Getting interviewer availability took ${String(graphTime) }ms in total`);

  return optimalSchedules;
}

function parseNumArrayToTimes(interviews, solution, blockStart) {
  const interviewConfiguration = JSON.parse(JSON.stringify(interviews));
  for (let i = 0; i < interviews.length; i++) {
    const start = solution.indexOf(i) * TIME_INTERVAL;
    const end = start + interviews[i].duration;

    DEBUG && console.log(`I = ${String(i) } ${String(start) } ${String(end)}`);

    interviewConfiguration[i].start = blockStart.clone().add(start, 'minute');
    interviewConfiguration[i].end = blockStart.clone().add(end, 'minute');

    DEBUG && console.log(`${interviewConfiguration[i].start.format()}  :  ${interviewConfiguration[i].end.format()}`);
  }


  DEBUG && console.log('Interview Configuration:');
  DEBUG && console.log(interviewConfiguration);

  return interviewConfiguration;
}

async function getRoomList() {
  const sql = 'SELECT * FROM Rooms WHERE status="A"';

  return new Promise((resolve, reject) => {
    db.query(sql, async (err, result) => {
      if (err) {
        return result.status(500).send({ message: 'Internal server Error.' });
      }

      let locations = [{}];
      if (result.length > 0) {
        locations = result.map((room) => ({
          displayName: room.name,
          locationEmailAddress: room.email,
        }));
        resolve(locations);
      } else {
        return reject('No interview rooms found');
      }
    });
  });
}

function assignRooms(rooms, roomAvailability, interviews, blockStart) {
  for (let i = 0; i < interviews.length; i++) {
    const startIndex = moment.duration(interviews[i].start.diff(blockStart)).asMinutes() / TIME_INTERVAL;

    interviews[i].room = [];

    for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
      let j = startIndex;
      const roomEmail = rooms[roomIndex].locationEmailAddress;
      while (roomAvailability.get(roomEmail)[j]) {
        j++;
        if (j == startIndex + (interviews[i].duration / TIME_INTERVAL)) {
          interviews[i].room.push(rooms[roomIndex]);
          break;
          /**
                     * NB: We don't have to worry about updating room avail because
                     *     we know that we will never have two interviews that
                     *     overlap as the candidate can't be in two places at once.
                     */
        }
      }
    }

    if (interviews[i].room == []) {
      console.log('No rooms found for interview!');
      // DEBUG && console.log("No rooms found for interview!")
      return null;
    }
  }
  DEBUG && console.log(interviews);
  return interviews;
}

function availStringToBoolArray(availabilityString) {
  const boolArray = [];
  for (let i = 0; i < availabilityString.length; i++) {
    boolArray.push(availabilityString.charAt(i) == '0');
  }
  return boolArray;
}

async function getAvailability(email) {
  const sql = db.format(GET_AVAILABILITY_SQL, [email]);

  return new Promise((resolve, reject) => {
    db.query(sql, async (err, result) => {
      if (err) {
        return result.status(500).send({ message: 'Internal server Error.' });
      }

      if (result.length === 0) {
        return reject('No candidate availability found');
      }
      resolve(result);
    });
  }).catch((err) => {
    console.error('Unable to get candidate availability');
  });
}

async function getInterviewerAvailability(emails, from, to, token) {
  try {
    const response = await axios({
      url: 'https://graph.microsoft.com/v1.0/me/calendar/getschedule',
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        Schedules: emails,
        StartTime: {
          dateTime: from.format(),
          timeZone: 'Pacific Standard Time',
        },
        EndTime: {
          dateTime: to.format(),
          timeZone: 'Pacific Standard Time',
        },
        availabilityViewInterval: String(TIME_INTERVAL),
      },
    });
    const availMap = new Map();
    response.data.value.forEach((interviewer) => {
      availMap.set(interviewer.scheduleId,
        availStringToBoolArray(interviewer.availabilityView));
    });
    return availMap;
  } catch (err) {
    console.error(err);
    // response.status(err.response.status).send(err.message);
  }
}

function fitInterview(currentSolution, availability, interview, interviewId, startIndex = 0, backwards = false) {
  const durationLength = interview.duration / TIME_INTERVAL;
  const index = startIndex;

  for (let index = startIndex; index <= currentSolution.length - durationLength; index++) {
    if (checkInterviewFits(currentSolution, availability, interview, index)) {
      return currentSolution.fill(interviewId, index, index + durationLength);
    }
  }
  return null;
}

function checkInterviewFits(currentSolution, availability, interview, startIndex) {
  for (let i = startIndex; i < startIndex + (interview.duration / TIME_INTERVAL); i++) {
    if (currentSolution[i] != -1) {
      return false;
    }

    for (let interviewer = 0; interviewer < interview.required.length; interviewer++) {
      if (!availability.get(interview.required[interviewer])[i]) {
        DEBUG && console.log(`${String(interview.required[interviewer])} busy at ${String(i)}`);
        return false;
      }
    }
  }
  return true;
}

/**
 *
 * @param {[number]} sequence
 */
function getTotalTime(sequence) {
  let start = 0; let
    end = sequence.length;

  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] != -1) {
      start = i;
      break;
    }
  }
  for (let i = sequence.length - 1; i > 0; i--) {
    if (sequence[i] != -1) {
      end = i + 1;
      break;
    }
  }

  return (end - start) * TIME_INTERVAL;
}

function getPermutations(indexes) {
  const perms = [];

  for (let i = 0; i < indexes.length; i += 1) {
    const rest = getPermutations(indexes.slice(0, i).concat(indexes.slice(i + 1)));

    if (!rest.length) {
      perms.push([indexes[i]]);
    } else {
      for (let j = 0; j < rest.length; j += 1) {
        perms.push([indexes[i]].concat(rest[j]));
      }
    }
  }
  return perms;
}

/**
 * @param {[Interview...]} interviews
 * @param {[boolean...]} availability
 * @returns {[number]} sequence of interviews where -1 indicates no interview,
 *                     and then 0...n indicates that index of interview
 */
function arrangeInterviews(interviews, availability, bestTime, totalInterviewLength) {
  const n = interviews.length;
  const time = availability.values().next().value.length;
  const permutations = (getPermutations([...Array(n).keys()]));

  let solutions = [];

  for (let permIndex = 0; permIndex < permutations.length; permIndex++) {
    const perm = permutations[permIndex];

    for (let startIndex = 0; startIndex <= time - totalInterviewLength; startIndex++) {
      // Fresh solution
      let solution = new Array(time).fill(-1);

      // Fit each interview
      for (let interviewIndex = 0; interviewIndex < n; interviewIndex++) {
        solution = fitInterview(solution,
          availability,
          interviews[perm[interviewIndex]],
          perm[interviewIndex],
          startIndex + interviewIndex);

        // Break if we couldn't fit that interview
        if (solution == null) {
          break;
        }
      }

      if (solution == null) {
        continue;
      }

      const totalTime = getTotalTime(solution);
      if (totalTime == bestTime) {
        solutions.push(solution);
      } else if (totalTime < bestTime) {
        bestTime = totalTime;
        solutions = []; // Empty the list of solutions as we've found better ones
        solutions.push(solution);
      }
    }
  }
  return { best: bestTime, sequence: solutions };
}

module.exports.findTimes = findTimes;
module.exports.Interview = Interview;
