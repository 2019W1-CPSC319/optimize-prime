//Imports
const moment = require('moment')
const axios = require('axios');
const db = require('../init/setupMySql');

//File Constants
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

    let rawAvail = await getAvailability(candidateEmail);

    //Tidy up the availability to make it easier to use
    let availability = [];
    rawAvail.forEach(element => {
        availability.push({
            start: moment(element.startTime),
            end: moment(element.endTime)
        })
    });
    DEBUG && console.log("candidate availability:")
    DEBUG && console.log(availability)

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
        allRequired = allRequired.concat(interview.required)
    });
    DEBUG && console.log("Total interview time = " + String(totalTime));
    DEBUG && console.log("All required interviewers = " + String(allRequired));

    let optimalSchedules = [];
    let best = Number.MAX_VALUE;

    for (block = 0; block < availability.length; block++) {
        let start = availability[block].start, end = availability[block].end;

        // Make sure that the block is longer than the duration of all interviews
        let blockDuration = moment.duration(end.diff(start)).asMinutes();
        if (totalTime > blockDuration) {
            DEBUG && console.log("Block " + String(block) + " is too short (" + String(blockDuration) + " mins)");
            continue;
        }

        // Get Availabilities of all interviewers for this block
        let avails = await getInterviewerAvailability(allRequired, start, end, token);
        DEBUG && console.log("Availabilities: ")
        DEBUG && console.log(avails);

        let schedules = arrangeInterviews(interviews, avails, best, totalTime / TIME_INTERVAL);

        //godlike one-liner to remove duplicates
        schedules.sequence = Array.from(new Set(schedules.sequence.map(JSON.stringify))).map(JSON.parse);

        if (DEBUG) {
            console.log(String(schedules.sequence.length) + " Schedules for " + String(start) + ":");
            for (let x = 0; x < schedules.sequence.length; x++) {
                console.log(String(schedules.sequence[x]));
            }
        }
        // parseNumArrayToTimes(interviews, schedules.sequence[0], start)
        if (schedules.best < best) {
            best = schedules.best;
            optimalSchedules = schedules.sequence
        } else if (schedules.best == best) {
            optimalSchedules = optimalSchedules.concat(schedules.sequence)
        }
    }
    //Kept even when debug disabled
    const algorithmRunTime = new Date().getTime() - algorithmStartTime;
    console.log("Found " +
                String(optimalSchedules.length) +
                " optimal interview schedules in " +
                String(algorithmRunTime) +
                "ms.");

    return optimalSchedules;
}

function parseNumArrayToTimes(interviews, solution, blockStart) {
    let interviewConfiguration = JSON.parse(JSON.stringify(interviews));
    for (let index = 0; index < solution.length; index++) {
        if (solution[index] == -1) {
            continue;
        }

        let start = index, end = index;
        let currentInterview = solution[index];
        while (solution[index + 1] == currentInterview) {
            index++;
        }
        end = index;

        DEBUG && console.log("I = " + String(currentInterview) + " " + String(start * TIME_INTERVAL) + " " + String(end * TIME_INTERVAL));

        interviewConfiguration[currentInterview].start = blockStart.clone().add(start * TIME_INTERVAL, 'minute');
        interviewConfiguration[currentInterview].end = blockStart.clone().add(end + 1 * TIME_INTERVAL, 'minute');
        DEBUG && console.log(interviewConfiguration[currentInterview].start.format() + "  :  " + interviewConfiguration[currentInterview].end.format())
    }

    DEBUG && console.log("Interview Configuration:");
    DEBUG && console.log(interviewConfiguration);
    return interviewConfiguration;
}

function availStringToBoolArray(availabilityString) {
    let boolArray = []
    for (let i = 0; i < availabilityString.length; i++) {
        boolArray.push(availabilityString.charAt(i) == '0' ? true : false)
    }
    return boolArray;
}

async function getAvailability(email) {
  const sql = db.format(GET_AVAILABILITY_SQL, [email]);

  return new Promise((resolve, reject) => {
      db.query(sql, async (err, result) => {
        if (err) {
            throw err;
        }

        if (result.length === 0) {
            return reject("No candidate availability found");
        } else {
            resolve(result);
        }
        });
    }).catch((err) => {
        console.error("Unable to get candidate availability");
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
              timeZone: "Pacific Standard Time"
          },
          EndTime: {
              dateTime: to.format(),
              timeZone: "Pacific Standard Time"
          },
          availabilityViewInterval: String(TIME_INTERVAL)
      }
    });
    let availMap = new Map();
    response.data.value.forEach((interviewer) => {
        availMap.set(interviewer.scheduleId, 
                     availStringToBoolArray(interviewer.availabilityView));
    })
    return availMap;
  } catch (err) {
    console.error(err);
    //response.status(err.response.status).send(err.message);
  }
}

function fitInterview(currentSolution, availability, interview, interviewId, startIndex = 0, backwards = false) {
    let durationLength = interview.duration / TIME_INTERVAL;
    let index = startIndex;

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
            if(!availability.get(interview.required[interviewer])[i]) {
                DEBUG && console.log(String(interview.required[interviewer]) + " busy at " + String(i))
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
    let start = 0, end = sequence.length;

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
    let perms = [];
  
    for (let i = 0; i < indexes.length; i = i + 1) {
      let rest = getPermutations(indexes.slice(0, i).concat(indexes.slice(i + 1)));
  
      if(!rest.length) {
        perms.push([indexes[i]])
      } else {
        for(let j = 0; j < rest.length; j = j + 1) {
          perms.push([indexes[i]].concat(rest[j]))
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
    let n = interviews.length;
    let time = availability.values().next().value.length;
    let permutations = (getPermutations([...Array(n).keys()]))

    let solutions = [];

    for (let permIndex = 0; permIndex < permutations.length; permIndex++) {
        let perm = permutations[permIndex]

        for (let startIndex = 0; startIndex <= time - totalInterviewLength; startIndex++) {
            // Fresh solution
            let solution = new Array(time).fill(-1);

            //Fit each interview
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

            let totalTime = getTotalTime(solution);
            if (totalTime == bestTime) {
                solutions.push(solution);
            } else if (totalTime < bestTime) {
                bestTime = totalTime;
                solutions = [] //Empty the list of solutions as we've found better ones
                solutions.push(solution)
            }
        }
    }
    return {best: bestTime, sequence: solutions};
}

module.exports.findTimes = findTimes;
module.exports.Interview = Interview;