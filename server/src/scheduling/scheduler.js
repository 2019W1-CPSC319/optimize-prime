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
    token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IlBKREh3QVUxcUIycUVjNnVyWTJ3SlJuUm9lclZVc29ERjNsN1JRVDBIYmsiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84Nzk2NTM5Ny04NTRhLTQzNjYtYjQ2MS1iNWQyODExZTU5ZGQvIiwiaWF0IjoxNTczNjg3MzE5LCJuYmYiOjE1NzM2ODczMTksImV4cCI6MTU3MzY5MTIxOSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IjQyVmdZTkF2WjJ3VEtjOTU4K0JZK3Zrd0RUbUx2S25sci9RT3NoOTMzcjFubVozQisyMEEiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdhbHZhbml6ZSIsImFwcGlkIjoiMDk3MDY5MGQtOWM3ZS00Y2NmLThlNWMtMjk3NmYzY2RiYjUxIiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJIZW5hZ2hhbiIsImdpdmVuX25hbWUiOiJCZW4iLCJpcGFkZHIiOiIyMDYuODcuMjM5LjE3MiIsIm5hbWUiOiJCZW4gSGVuYWdoYW4iLCJvaWQiOiJhOWYyMzdjYi00NGQ4LTQ4NjUtODQzOC01ZWQ3MzE5NzdiZmEiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDA4MTNEMUE0OSIsInNjcCI6IkNhbGVuZGFycy5SZWFkIENhbGVuZGFycy5SZWFkLlNoYXJlZCBDYWxlbmRhcnMuUmVhZFdyaXRlIENhbGVuZGFycy5SZWFkV3JpdGUuU2hhcmVkIE1haWwuU2VuZCBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCBlbWFpbCIsInN1YiI6IlRYcmR2c0IzNWR4Zy14ci1xeG5fdFV1S0V0Y2gyVTVUWUtTdkgyenlZeUkiLCJ0aWQiOiI4Nzk2NTM5Ny04NTRhLTQzNjYtYjQ2MS1iNWQyODExZTU5ZGQiLCJ1bmlxdWVfbmFtZSI6ImJlbmhlbmFnaGFuQG9wdGltaXplcHJpbWUub25taWNyb3NvZnQuY29tIiwidXBuIjoiYmVuaGVuYWdoYW5Ab3B0aW1pemVwcmltZS5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJZVGx1UTJyUm1VU1hfbWoxTUtnMEFRIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiXSwieG1zX3N0Ijp7InN1YiI6Im16RS1jLTAyOUZsTEtGaXZlZWcwZ3NGYlMxMDdtTHN4T05mMy1HV18teUEifSwieG1zX3RjZHQiOjE1NzIzODE3ODR9.fOXv5ypuno-8UkJ4gZOUd-4gwHoVil2X1PPFhZxrnQx84uDRYZREcbziuuzNP_TDzCFfdTQAlT6_GJC7KmqYfRosJBXuFInsT2BprFTgoDYAxfsXpJlpSL63lGOIhWMkf7BBFPJJaZfj74AAtafpNdv3a3AVl8twj2BDRdco3XWCbSwtnghchuP-vn8Idhew3XEPIJ7YaaxihfQKIGiUj13oo5SGuUbVZU3jZJEQr4AgL4sdWu3VKIIQZh0Z0FrmbY9NdiTvs6_XBZRVuWxmNFqojrC7TkYjoXG-hH1eZtPMOyIdg5Fs2bdiUXDJMWJzMrQRBJeGsVbVj7MTKJBpUw"

    let rawAvail = await getAvailability(candidateEmail);

    //Tidy up the availability to make it easier to use
    let availability = [];
    rawAvail.forEach(element => {
        availability.push({
            start: moment(element.startTime),
            end: moment(element.endTime)
        })
    });
    console.log(availability)

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
        arrangeInterviews(interviews, avails);

    }
}

function availStringToBoolArray(availabilityString) {
    let boolArray = []
    for (i = 0; i < availabilityString.length; i++) {
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
    //todo
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

function findAvailable(availability, duration, backwards=false) {
    let durationLength = duration / TIME_INTERVAL;
    for (interval = 0; interval < availability.length; interval++) {
        // if (availability.charAt())
    }
}

function getWastedTime(sequence) {
    
}

/**
 * To say this is unoptimized is an understatement
 * @param {[Interview...]} interviews 
 * @param {[boolean...]} availability 
 * @returns {[number]} sequence of interviews where -1 indicates no interview,
 *                     and then 0...n indicates that index of interview
 */
function arrangeInterviews(interviews, availability) {
    let n = interviews.length;
    let solution = new Array(availability[0].length).fill(-1);

    for (i = 0; i < n; i++) {

    }
    
    return solution;
}

module.exports.findTimes = findTimes;
module.exports.Interview = Interview;