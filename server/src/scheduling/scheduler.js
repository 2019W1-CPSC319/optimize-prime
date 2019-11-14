//Imports
const moment = require('moment')
const axios = require('axios');
const db = require('../init/setupMySql');

//File Constants
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
    // TODO
    token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IkY5bmJNVDFFeE83Tkp0NE1kczUyX21US2pJTVhMb19BNl9XNXZhQ2xTWmciLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84Nzk2NTM5Ny04NTRhLTQzNjYtYjQ2MS1iNWQyODExZTU5ZGQvIiwiaWF0IjoxNTczNzY1MDA1LCJuYmYiOjE1NzM3NjUwMDUsImV4cCI6MTU3Mzc2ODkwNSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhOQUFBQWh2c1pVS01UZUtGM01OdVBkc3dIcTY2RnIwN1pzS2lLejIyYlArM2p3ZVE9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJHYWx2YW5pemUiLCJhcHBpZCI6IjA5NzA2OTBkLTljN2UtNGNjZi04ZTVjLTI5NzZmM2NkYmI1MSIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiSGVuYWdoYW4iLCJnaXZlbl9uYW1lIjoiQmVuIiwiaXBhZGRyIjoiMjA2Ljg3LjIzMi4xMTgiLCJuYW1lIjoiQmVuIEhlbmFnaGFuIiwib2lkIjoiYTlmMjM3Y2ItNDRkOC00ODY1LTg0MzgtNWVkNzMxOTc3YmZhIiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMyMDAwODEzRDFBNDkiLCJzY3AiOiJDYWxlbmRhcnMuUmVhZCBDYWxlbmRhcnMuUmVhZC5TaGFyZWQgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDYWxlbmRhcnMuUmVhZFdyaXRlLlNoYXJlZCBNYWlsLlNlbmQgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwgZW1haWwiLCJzdWIiOiJUWHJkdnNCMzVkeGcteHItcXhuX3RVdUtFdGNoMlU1VFlLU3ZIMnp5WXlJIiwidGlkIjoiODc5NjUzOTctODU0YS00MzY2LWI0NjEtYjVkMjgxMWU1OWRkIiwidW5pcXVlX25hbWUiOiJiZW5oZW5hZ2hhbkBvcHRpbWl6ZXByaW1lLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6ImJlbmhlbmFnaGFuQG9wdGltaXplcHJpbWUub25taWNyb3NvZnQuY29tIiwidXRpIjoiY0FBc1RtRmtHMFdTaTRlTEEwY0hBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIl0sInhtc19zdCI6eyJzdWIiOiJtekUtYy0wMjlGbExLRml2ZWVnMGdzRmJTMTA3bUxzeE9OZjMtR1dfLXlBIn0sInhtc190Y2R0IjoxNTcyMzgxNzg0fQ.E1fnbGHmkD7yFz598gKWiJk_LFiCJqZ1FvYzByUEvKoBMygWbxJL1OnULP-VE7vDSDz4LY5enH7KJ-dMATCvjYAWkDkTs9fQoiAySOGHezzN-YuXx0emeheoQoAqbcI5eelsobnLY6pWIgZEOltaSDHl6RBBCJqAj84D5ZCuHJFmIBor4gvMKODNw1UQUN5jJdKex6YOfnkdiOZ5cLIUY-skOy_FUxTIPQyE0-Q_y5vdwhEFim-DxbGvPsTRaBmmYdr1UmF7eVJEwV9yZJjFeL0blAI9N2joq_9aVGrxl7Zs36_lvylKHKI8xo04-3mmmDBkQi_V-o8RY_z_DXXfrw"

    let rawAvail = await getAvailability(candidateEmail);

    //Tidy up the availability to make it easier to use
    let availability = [];
    rawAvail.forEach(element => {
        availability.push({
            start: moment(element.startTime),
            end: moment(element.endTime)
        })
    });
    //console.log(availability)

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
    console.log("Total interview time = " + String(totalTime));
    console.log("All required interviewers = " + String(allRequired));

    let optimalSchedules = [];

    for (block = 0; block < availability.length; block++) {
        let start = availability[block].start, end = availability[block].end;

        // Make sure that the block is longer than the duration of all interviews
        let blockDuration = moment.duration(end.diff(start)).asMinutes();
        if (totalTime > blockDuration) {
            console.log("Block " + String(block) + " is too short (" + String(blockDuration) + " mins)");
            continue;
        }

        // Get Availabilities of all interviewers for this block
        let avails = await getInterviewerAvailability(allRequired, start, end, token);
        console.log(avails);
        let schedules = arrangeInterviews(interviews, avails);
        optimalSchedules = optimalSchedules.concat(schedules)
    }
    console.log(optimalSchedules);
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
        console.log("Unable to get candidate availability");
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

function fitInterview(currentSolution, availability, interview, interviewId, backwards=false) {
    let durationLength = interview.duration / TIME_INTERVAL;
    let interval = 0;
    // console.log(currentSolution);
    // console.log(j)
    while (interval < currentSolution.length - durationLength) {
        // Make sure the slot is free
        if (currentSolution[interval] != -1) {
            interval++;
            continue;
        }
        let fitsAll = true;
        for (let i = interval; i < interval + durationLength; i++) {
            if (currentSolution[interval] != -1) {
                interval = i + 1;
                break;
            }
            let fits = true;
            // console.log(interview.required)
            interview.required.forEach((interviewer) => {
                fits = fits && availability.get(interviewer)[i];
                // if (!fits) {
                //     break;
                // }
            })
            fitsAll = fits;
            if (!fitsAll) {
                interval = i + 1;
                break;
            }
        }

        // The interview fits in this spot
        if (fitsAll) {
            //console.log(interviewId);
            solution = currentSolution.fill(interviewId, interval, interval + durationLength);
            return solution
        }
    }
    return null;
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
            end = i;
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
function arrangeInterviews(interviews, availability) {
    let n = interviews.length;
    let time = availability.values().next().value.length;
    let permutations = (getPermutations([...Array(n).keys()]))
    console.log(permutations)
    console.log(permutations.length);
    console.log("time = " + String(time))
    
    let bestTime = Number.MAX_VALUE;
    let solutions = [];
    for (let permIndex = 0; permIndex < permutations.length; permIndex++) {
        let solution = new Array(time).fill(-1);
        let perm = permutations[permIndex]
        console.log(permutations.length)
        console.log("Permutation " + String(permIndex) + " : " + String(perm));

        //Fit each interview
        for (let j = 0; j < n; j++) {
            solution = fitInterview(solution, availability, interviews[perm[j]], perm[j]);
            // Break if we couldn't fit that interview
            if (solution == null) {
                console.log("no fit");
                break;
            }
        }
        console.log(solution)
        if (solution == null) {
            console.log("null")
            continue;
        }
        let totalTime = getTotalTime(solution);
        console.log("totalTime = " + String(totalTime));
        if (totalTime <= bestTime) {
            console.log("new best");
            bestTime = totalTime;
            solutions.push(solution);
        }
    }
    console.log("Final solutions:");
    console.log(solutions);
    return solutions;
}

module.exports.findTimes = findTimes;
module.exports.Interview = Interview;