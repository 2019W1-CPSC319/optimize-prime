import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
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
  redirect: false,
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
    this.setState({ reqOpen: true, optOpen: false });
  }

  handleClose = () => {
    swalWithBootstrapButtons.fire(
      'Cancelled',
      'Your progress has not been saved!',
      'error'
    );
    this.setState({ ...initialState, redirect: true });
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
      this.setState({ reqOpen: false, optOpen: true });
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
    this.setState({ ...initialState, onSuccess: true, redirect: true });
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

  async componentDidMount() {
    const { actions, id } = this.props;
    await actions.getUsers('candidate');
    await actions.getUsers('interviewer');
    await actions.getInterviews();
    await actions.getOutlookUsers();
    if (id) {
      const { candidates } = this.props;
      this.setState({
        reqOpen: true,
        candidate: candidates.find(candidate => candidate.id == id),
      });
    }
  }

  render() {
    const { interviews } = this.props;
    const { redirect } = this.state;
    return (
      <div>
        {redirect && <Redirect to='/calendar' />}
        <h1 style={{ marginLeft: '30px', fontWeight: 'normal' }}>Scheduled Interviews</h1>
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
                      <TableCell align="center">{interview.candidate.firstName + ' ' + interview.candidate.lastName}</TableCell>
                      <TableCell align="center">{interview.room.name}</TableCell>
                      <TableCell align="center">{interview.room.seats}</TableCell>
                      <TableCell align="center">{moment(interview.startTime).format('ll h:mm a')}</TableCell>
                      <TableCell align="center">{moment(interview.endTime).format('ll h:mm a')}</TableCell>
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
