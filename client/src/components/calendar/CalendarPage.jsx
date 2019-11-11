import React from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
// import config from '../../Config';
import Swal from 'sweetalert2';
import axios from 'axios';
// import { getEvents } from '../../GraphService';
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

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      optOpen: false,
      reqOpen: false,
      onSuccess: false,
      onSlide: false,
      required: [],
      optional: [],
      selected: 0,
      selectedOption: 0,
      background: ['#280e3a', '#fff', '#fff', '#fff'],
      color: ['#fff', '#000', '#000', '#000'],
      candidate: '',
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
    this.setState({ reqOpen: false });
    this.setState({ optOpen: false });
    this.setState({ required: [] });
    this.setState({ optional: [] });
    this.setState({ candidate: '' });
  }

  updateCandidate = (event) => {
    // console.log(event.target.value)
    this.setState({ candidate: event.target.value });
  }

  updateCandidateAutosuggested = (event) => {
    event.persist();
    this.setState({ candidate: event.target.textContent });
  }

  updateRequiredInterviewers = (event) => {
    // console.log(event.target.value)
    this.setState({ required: event.target.value });
  }

  updateOptionalInterviewers = (event) => {
    // console.log(event.target.value)
    this.setState({ optional: event.target.value });
  }

  handleNext = async () => {
    const { actions } = this.props;
    try {
      await actions.findMeetingTimes({
        candidate: this.state.candidate,
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
    const { selectedOption, candidate: candidateEmail, required, optional } = this.state;
    const { meetingSuggestions, actions, candidates } = this.props;
    const selectedSuggestion = meetingSuggestions.data[selectedOption];
    const candidateUser = candidates.find(candidate => candidate.email === candidateEmail);
    actions.createEvent(selectedSuggestion, candidateUser, required, optional);

    swalWithBootstrapButtons.fire(
      'Success',
      'Successfully scheduled',
      'success'
    );

    // Clear state of dialog
    this.setState({ reqOpen: false });
    this.setState({ optOpen: false });
    this.setState({ onSuccess: true });
    this.setState({ required: [] });
    this.setState({ optional: [] });
    this.setState({ candidate: '' });
  }

  handleSelectInterviewDuration = (i) => {
    this.setState({ selected: i });
  }

  handleSelectOption = (i) => {
    console.log(i)
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
    const { actions } = this.props;
    await actions.getUsers('candidate');
    await actions.getUsers('interviewer');
    if (!this.props.interviews) await actions.getInterviews();
  }

  render() {
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
              {this.props.interviews && this.props.interviews.map(
                interview => {
                  return (
                    <TableRow key={interview.id}>
                      <TableCell align="center">{interview.firstName + ' ' + interview.lastName}</TableCell>
                      <TableCell align="center">{interview.name}</TableCell>
                      <TableCell align="center">{interview.seats}</TableCell>
                      <TableCell align="center">{formatDateTime(interview.startTime)}</TableCell>
                      <TableCell align="center">{formatDateTime(interview.endTime)}</TableCell>
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
