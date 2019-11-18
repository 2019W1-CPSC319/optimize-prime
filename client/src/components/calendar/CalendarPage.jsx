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
  rows: [],
  onSuccess: false,
  selectedOption: 0,
}

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
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

  handleAddRow = () => {
    const { rows } = this.state;
    this.setState({
      rows: [...rows, this.createRow()]
    });
  }

  handleRemoveRow = (index) => {
    const { rows } = this.state;
    rows.splice(index, 1);
    this.setState({ rows });
  }

  createRow = (required = [], optional = [], duration = 30) => {
    return { required, optional, duration };
  }

  handleAutocompleteChange = (event, value, index, field) => {
    event.persist();
    const { rows } = this.state;
    rows[index][field] = value;
    this.setState({ rows });
  }

  handleSelectorChange = (event, index, field) => {
    event.persist();
    const { rows } = this.state;
    rows[index][field] = event.target.value;
    this.setState({ rows });
  }

  handleNext = async () => {
    const { actions } = this.props;
    const { candidate, rows } = this.state;
    try {
      // Ben's implementation
      // const data = {
      //   candidate: candidate.email,
      //   interviews: rows.map(row => ({
      //     required: row.required.map(interviewer => interviewer.email),
      //     optional: row.optional.map(interviewer => interviewer.email),
      //     room: "",
      //     duration: row.duration
      //   })),
      // };
      const data = {
        candidate: candidate.email,
        interviews: rows.map(row => ({
          required: row.required.map(interviewer => interviewer.email),
          optional: row.optional.map(interviewer => interviewer.email),
          room: "",
          meetingDuration: this.getInterviewDuration(row.duration),
        })),
      };
      console.log(data)
      // Ben's implementation
      // await actions.findAllMeetingTimes(data);
      // TODO: Add controls for 1. displayed schedules per page and 2. current page number
      await actions.findMeetingTimes(data, 5, 1);
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
          handleAddRow={this.handleAddRow}
          handleRemoveRow={this.handleRemoveRow}
          handleSelectorChange={this.handleSelectorChange}
          handleAutocompleteChange={this.handleAutocompleteChange}
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
