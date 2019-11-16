import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import RequestDialog from './RequestDialog';
import OptionsDialog from './OptionsDialog';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import { green } from '@material-ui/core/colors';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Fab,
  SnackbarContent,
  Snackbar,
  Slide,
} from '@material-ui/core';

function formatDateTime(dateTime) {
  return moment.utc(dateTime).local().format('M/D/YY h:mm A');
}

export const FIELD_DURATION = 1;
export const FIELD_REQUIRED = 2;
export const FIELD_PROFILE = 3;

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true
})

const styles = theme => ({});

const initialState = {
  reqOpen: false,
  optOpen: false,
  required: [],
  optional: [],
  candidate: { email: '' },
  rows: []
}

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
      // events: [],
      onSuccess: false,
      // onSlide: false,
      // selected: 0,
      selectedOption: 0,
      background: ['#280e3a', '#fff', '#fff', '#fff'],
      color: ['#fff', '#000', '#000', '#000'],
      // durations: [
      //   { minutes: 30 },
      //   { minutes: 60 },
      //   { minutes: 90 },
      //   { minutes: 120 }
      // ]
    };
  }

  getInterviewDuration = (minutes) => {
    switch (minutes) {
      case 30:
        return 'PT30M';
      case 60:
        return 'PT1H';
      case 90:
        return 'PT1H30M';
      case 120:
        return 'PT2H';
    }
  }

  handleOpen = () => {
    this.setState({ reqOpen: true });
    this.setState({ optOpen: false });
  }

  handleClose = () => {
    swalWithBootstrapButtons.fire(
      'Cancelled',
      'Your progress has not been saved!',
      'error'
    )
    this.setState({ ...initialState });
  }

  updateCandidate = (event, candidate) => {
    this.setState({ candidate });
    console.log(candidate)
  }

  // updateRequiredInterviewers = (event, value) => {
  //   this.setState({ required: value });
  // }

  // updateOptionalInterviewers = (event, value) => {
  //   this.setState({ optional: value });
  // }

  // updateInterviewer = (event, row, index, required = false, duration = 30) => {
  //   debugger;
  //   // const { rows } = this.state;
  //   const rows = this.state.rows;
  //   rows[index] = { ...row, required, duration };
  //   // removeInterviewer(index);
  //   this.setState({ rows });
  //   console.log(this.state.rows);
  // }

  // updateInterviewerProfile = (event, row, index) => {
  //   debugger;
  //   // const { rows } = this.state;
  //   const rows = this.state.rows;
  //   rows[index] = row;
  //   // removeInterviewer(index);
  //   this.setState({ rows });
  //   console.log(this.state.rows);
  // }

  // updateInterviewerStatus = (event, row, index, required) => {
  //   debugger;
  //   // const { rows } = this.state;
  //   const rows = this.state.rows;
  //   rows[index] = { ...row, required };
  //   // removeInterviewer(index);
  //   this.setState({ rows });
  //   console.log(this.state.rows);
  // }

  // updateInterviewerDuration = (event, row, index, duration) => {
  //   debugger;
  //   // const { rows } = this.state;
  //   const rows = this.state.rows;
  //   rows[index] = { ...row, duration };
  //   // removeInterviewer(index);
  //   this.setState({ rows });
  //   console.log(this.state.rows);
  // }

  handleAddRow = () => {
    debugger;
    const { rows } = this.state;
    this.setState({
      rows: [...rows, this.createRow()]
    });
  }

  handleRemoveRow = (index) => {
    debugger;
    // const { rows } = this.state;
    const rows = this.state.rows;
    rows.splice(index, 1);
    this.setState({ rows });
    console.log(rows)
  }

  createRow = (id = '', firstName = '', lastName = '', email = '', phone = '', status = '', required = false, duration = 30) => {
    return { id, firstName, lastName, email, phone, status, required, duration };
  }

  handleSelectorChange = (event) = (event, index, field) => {
    event.persist();
    console.log(event);
    console.log(index)
    console.log(field)
    debugger;
    const { interviewers } = this.props;
    const rows = this.state.rows;
    switch (field) {
      case FIELD_DURATION:
        rows[index].duration = event.target.value;
        break;
      case FIELD_REQUIRED:
        rows[index].required = event.target.checked;
        break;
      case FIELD_PROFILE:
        rows[index] = { ...rows[index], ...interviewers[event.target.dataset.optionIndex] };
        break;
    }
    // for (const row of rows) {
    //   if (row.id == id) {
    //     if (field == FIELD_FROM) {
    //       row.from = event.target.value;
    //     } else {
    //       row.to = event.target.value;
    //     }
    //     row.timeValid = row.from < row.to;
    //   }
    // }
    this.setState({ rows });
    console.log(rows)
  }

  handleNext = async () => {
    const { actions } = this.props;
    const { candidate, rows } = this.state;
    try {
      // await actions.findMeetingTimes({
      //   candidate: this.state.candidate.email,
      //   required: this.state.required,
      //   optional: this.state.optional,
      //   meetingDuration: this.getInterviewDuration(),
      // });
      const data = {
        candidate: candidate.email,
        interviews: [
          {
            required: rows.filter(row => row.required && row.duration === 30),
            optional: rows.filter(row => !row.required && row.duration === 30),
            room: "",
            duration: 30
          },
          {
            required: rows.filter(row => row.required && row.duration === 60),
            optional: rows.filter(row => !row.required && row.duration === 60),
            room: "",
            duration: 60
          },
          {
            required: rows.filter(row => row.required && row.duration === 90),
            optional: rows.filter(row => !row.required && row.duration === 90),
            room: "",
            duration: 90
          },
          {
            required: rows.filter(row => row.required && row.duration === 120),
            optional: rows.filter(row => !row.required && row.duration === 120),
            room: "",
            duration: 120
          }
        ]
      };
      console.log(data)
      await actions.findAllMeetingTimes(data);
      this.setState({ reqOpen: false });
      this.setState({ optOpen: true });
    } catch (err) {
      console.error(err);
    }
  }

  handleSave = () => {
    const { selectedOption, candidate: selectedCandidate, required, optional } = this.state;
    const { meetingSuggestions, actions, candidates } = this.props;
    const selectedSuggestion = meetingSuggestions.data[selectedOption];
    const candidateUser = candidates.find(candidate => candidate.email === selectedCandidate.email);
    actions.createEvent(selectedSuggestion, candidateUser, required, optional);

    swalWithBootstrapButtons.fire(
      'Success',
      'Successfully scheduled',
      'success'
    );

    // Clear state of dialog
    this.setState({ ...initialState, onSuccess: true });
  }

  handleSelectInterviewDuration = (i) => {
    this.setState({ selected: i });
  }

  handleSelectOption = (i) => {
    // console.log(i)
    this.setState({ selectedOption: i });
  }

  showSnackbarOnSuccess = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.onSuccess}
        autoHideDuration={3000}
        onClose={() => this.setState({ onSuccess: false })}
      >
        <SnackbarContent
          style={{ backgroundColor: green[600], }}
          aria-describedby="client-snackbar"
          message={
            <Box component='span' id="client-snackbar" style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <CheckCircleIcon style={{ fontSize: 20, marginRight: '10px' }} />This is a success message!
            </Box>
          }
        />
      </Snackbar>
    )
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getUsers('candidate');
    actions.getUsers('interviewer');
    actions.getInterviews();
  }

  render() {
    const { interviews } = this.props;
    return (
      <div>
        <h1 style={{ marginLeft: '30px', fontWeight: 'normal' }}>Calendar</h1>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell scope="col" align="center">Candidate Name</TableCell>
                <TableCell scope="col" align="center">Location</TableCell>
                <TableCell scope="col" align="center">Capacity</TableCell>
                <TableCell scope="col" align="center">Start</TableCell>
                <TableCell scope="col" align="center">End</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interviews && interviews.map(
                (interview, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell align="center">{interview.firstName + ' ' + interview.lastName}</TableCell>
                      <TableCell align="center">{interview.name}</TableCell>
                      <TableCell align="center">{interview.seats}</TableCell>
                      <TableCell align="center"><Moment subtract={{ hours: 8 }} format='ll h:mm a' tz='America/Los_Angeles'>{interview.startTime}</Moment></TableCell>
                      <TableCell align="center"><Moment subtract={{ hours: 8 }} format='ll h:mm a' tz='America/Los_Angeles'>{interview.endTime}</Moment></TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: 'fixed', right: '30px', bottom: '30px', backgroundColor: '#003b9a' }}
          onClick={this.handleOpen}
        >
          <AddRoundedIcon />
        </Fab>
        <RequestDialog
          handleNext={this.handleNext}
          handleClose={this.handleClose}
          updateCandidate={this.updateCandidate}
          updateRequiredInterviewers={this.updateRequiredInterviewers}
          updateOptionalInterviewers={this.updateOptionalInterviewers}
          handleSelectInterviewDuration={this.handleSelectInterviewDuration}
          // updateInterviewer={this.updateInterviewer}
          // addInterviewer={this.addInterviewer}
          // removeInterviewer={this.removeInterviewer}
          handleSelectorChange={this.handleSelectorChange}
          handleAddRow={this.handleAddRow}
          handleRemoveRow={this.handleRemoveRow}
          {...this.props}
          {...this.state}
        />
        <OptionsDialog
          handleOpen={this.handleOpen}
          handleSave={this.handleSave}
          handleSelectOption={this.handleSelectOption}
          {...this.props}
          {...this.state}
        />
        {this.showSnackbarOnSuccess()}
      </div >
    );
  }
}

export default withStyles(styles)(CalendarPage);
