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
  candidate: { email: '' }
}

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
      events: [],
      onSuccess: false,
      onSlide: false,
      selected: 0,
      selectedOption: 0,
      background: ['#280e3a', '#fff', '#fff', '#fff'],
      color: ['#fff', '#000', '#000', '#000'],
      durations: [
        { minutes: 30 },
        { minutes: 60 },
        { minutes: 90 },
        { minutes: 120 }
      ]
    };
  }

  getInterviewDuration = () => {
    switch (this.state.durations[this.state.selected].minutes) {
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
  }

  updateCandidateAutosuggested = (event) => {
    event.persist();
    this.setState({ candidate: event.target.textContent });
  }

  updateRequiredInterviewers = (event, value) => {
    this.setState({ required: value });
  }

  updateOptionalInterviewers = (event, value) => {
    this.setState({ optional: value });
  }

  handleNext = async () => {
    const { actions } = this.props;
    try {
      await actions.findMeetingTimes({
        candidate: this.state.candidate.email,
        required: this.state.required,
        optional: this.state.optional,
        meetingDuration: this.getInterviewDuration(),
      });
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
    const response = actions.createEvent(selectedSuggestion, candidateUser, required, optional);

    if (response && !response.error) {
      swalWithBootstrapButtons.fire(
        'Success',
        'Successfully scheduled',
        'success'
      );
    }

    // Clear state of dialog
    this.setState({ ...initialState, onSuccess: true });
  }

  handleSelectInterviewDuration = (i) => {
    this.setState({ selected: i });
  }

  handleSelectOption = (i) => {
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
    actions.getOutlookUsers();
  }

  render() {
    const { interviews } = this.props;
    return (
      <div>
        <h1 style={{ marginLeft: '30px', fontWeight: 'normal' }}>Upcoming Interviews</h1>
        <Paper style={{ margin: '0 30px' }}>
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
                (interview, key) => {
                  return (
                    <TableRow key={key}>
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
          updateCandidateAutosuggested={this.updateCandidateAutosuggested}
          updateRequiredInterviewers={this.updateRequiredInterviewers}
          updateOptionalInterviewers={this.updateOptionalInterviewers}
          handleSelectInterviewDuration={this.handleSelectInterviewDuration}
          candidate={this.state.candidate}
          required={this.state.required}
          optional={this.state.optional}
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
