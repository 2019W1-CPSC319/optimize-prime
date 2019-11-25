import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';
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
  candidate: { email: '' },
  rows: [],
  onSuccess: false,
  selectedOption: 0,
  selectedRooms: {},
}

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
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
      const data = {
        candidate: candidate.email,
        interviews: rows.map(row => ({
          required: row.required.map(interviewer => interviewer.email),
          optional: row.optional.map(interviewer => interviewer.email),
          duration: row.duration
        })),
      };
      await actions.findAllMeetingTimes(data);
      this.setState({ reqOpen: false });
      this.setState({ optOpen: true });
    } catch (err) {
      console.error(err);
    }
  }

  handleSave = async () => {
    const { selectedOption, selectedRooms, candidate: selectedCandidate } = this.state;
    const { meetingSuggestions, actions, candidates } = this.props;
    const selectedSuggestions = meetingSuggestions.data[selectedOption];
    const candidateUser = candidates.find(candidate => candidate.email === selectedCandidate.email);
    const createEvents = selectedSuggestions.map(async (selectedSuggestion, i) => {
      const room = selectedSuggestion.room[selectedRooms[`${selectedOption}-${i}`] || 0];
      await actions.createEvent({ ...selectedSuggestion, room }, candidateUser);
    });

    const response = await Promise.all(createEvents);

    if (response && !response.error) {
      swalWithBootstrapButtons.fire(
        'Success',
        'Successfully scheduled',
        'success'
      );
    }

    // Clear state of dialog
    // this.setState({ ...initialState, onSuccess: true, redirect: true });
  }

  handleSelect = (mode, selected) => {
    this.setState({ [mode]: selected });
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
    const { actions, location } = this.props;
    await actions.getUsers('candidate');
    await actions.getUsers('interviewer');
    await actions.getInterviews();
    await actions.getOutlookUsers();
    this.setState({ ...initialState, redirect: true });
    const { state } = location;
    if (state && state.id) {
      const { candidates } = this.props;
      this.setState({
        reqOpen: true,
        redirect: false,
        candidate: candidates.find(candidate => candidate.id === state.id),
      });
    }
  }

  render() {
    const { interviews } = this.props;
    const { redirect } = this.state;
    return (
      <div>
        {redirect === true && <Redirect to='/calendar' />}
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
          handleSelect={this.handleSelect}
          {...this.props}
          {...this.state}
        />
        {this.showSnackbarOnSuccess()}
      </div >
    );
  }
}

export default withRouter(withStyles(styles)(CalendarPage));
