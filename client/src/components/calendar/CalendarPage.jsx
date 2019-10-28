import React from 'react';
import moment from 'moment';
// import config from '../../Config';
import Swal from 'sweetalert2';
import axios from 'axios';
// import { getEvents } from '../../GraphService';
import RequestDialog from './RequestDialog';
import OptionsDialog from './OptionsDialog';
import RoomDialog from './RoomDialog';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RoomRoundedIcon from '@material-ui/icons/RoomRounded';
import InsertInvitationRoundedIcon from '@material-ui/icons/InsertInvitationRounded';
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

export default class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      optOpen: false,
      reqOpen: false,
      roomOpen: false,
      onSuccess: false,
      onSlide: false,
      required: [],
      optional: [],
      selected: 0,
      selectedOpt: 0,
      background: ['#280e3a', '#fff', '#fff', '#fff'],
      color: ['#fff', '#000', '#000', '#000'],
      candidate: '',
      durations: [
        { minutes: 30 },
        { minutes: 45 },
        { minutes: 60 },
        { minutes: 90 },
      ]
    };
  }

  handleOpen = () => {
    this.setState({ reqOpen: true });
    this.setState({ optOpen: false });
  }

  handleOpenAddRoom = () => {
    console.log('merong')
    this.setState({ roomOpen: true });
  }

  handleClose = () => {
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'PROCEED',
      cancelButtonText: 'CANCEL',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
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
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.setState({ reqOpen: true });
        this.setState({ optOpen: false });
      }
    })
    this.setState({ reqOpen: false });
    this.setState({ optOpen: false });
  }

  handleCloseAddRoom = () => {
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'PROCEED',
      cancelButtonText: 'CANCEL',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your progress has not been saved!',
          'error'
        )
        this.setState({ roomOpen: false });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.setState({ roomOpen: false });
      }
    })
    this.setState({ roomOpen: false });
  }

  handleSliding = () => {
    this.setState({ onSlide: !this.state.onSlide });
  }

  updateCandidate = (event) => {
    console.log(event.target.value)
    this.setState({ candidate: event.target.value });
  }

  updateCandidateAutosuggested = (event) => {
    event.persist();
    this.setState({ candidate: event.target.textContent });
  }

  updateRequiredInterviewers = (event) => {
    console.log(event.target.value)
    this.setState({ required: event.target.value });
  }

  updateOptionalInterviewers = (event) => {
    console.log(event.target.value)
    this.setState({ optional: event.target.value });
  }

  handleNext = () => {
    // axios.get('http://localhost:8080/blocks/' + this.state.candidate)
    //   // .then(res => res.text())
    //   .then(res => this.setState({ candidates: res.data }));
    this.setState({ reqOpen: false });
    this.setState({ optOpen: true });
  }

  handleSave = () => {
    this.setState({ reqOpen: false });
    this.setState({ optOpen: false });
    this.setState({ onSuccess: true });
    this.setState({ required: [] });
    this.setState({ optional: [] });
    this.setState({ candidate: '' });
  }

  handleSaveAddRoom = () => {
    this.setState({ roomOpen: false });
    this.setState({ onSuccess: true });
  }

  handleSelectInterviewDuration = (i) => {
    this.setState({ selected: i });
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

  // async componentDidMount() {
  //   try {
  //     // Get the user's access token
  //     var accessToken = await window.msal.acquireTokenSilent({
  //       scopes: config.scopes
  //     });
  //     // Get the user's events
  //     var events = await getEvents(accessToken);
  //     // Update the array of events in state
  //     this.setState({ events: events.value });
  //   }
  //   catch (err) {
  //     this.props.showError('ERROR', JSON.stringify(err));
  //   }
  // }

  render() {
    return (
      <div>
        <h1 style={{ marginLeft: '30px', fontWeight: 'normal' }}>Calendar</h1>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell scope="col">Organizer</TableCell>
                <TableCell scope="col">Subject</TableCell>
                <TableCell scope="col">Start</TableCell>
                <TableCell scope="col">End</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.events.map(
                function (event) {
                  return (
                    <TableRow key={event.id}>
                      <TableCell>{event.organizer.emailAddress.name}</TableCell>
                      <TableCell>{event.subject}</TableCell>
                      <TableCell>{formatDateTime(event.start.dateTime)}</TableCell>
                      <TableCell>{formatDateTime(event.end.dateTime)}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
        <Slide direction="up" in={this.state.onSlide} mountOnEnter unmountOnExit>
          <Fab
            color="primary"
            aria-label="add"
            style={{ position: 'fixed', right: '30px', bottom: '170px', backgroundColor: '#e75480' }}
            onClick={this.handleOpen}
          >
            <InsertInvitationRoundedIcon />
          </Fab>
        </Slide>
        <Slide direction="up" in={this.state.onSlide} mountOnEnter unmountOnExit>
          <Fab
            color="primary"
            aria-label="add"
            style={{ position: 'fixed', right: '30px', bottom: '100px', backgroundColor: '#ffa500' }}
            onClick={this.handleOpenAddRoom}
          >
            <RoomRoundedIcon />
          </Fab>
        </Slide>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: 'fixed', right: '30px', bottom: '30px', backgroundColor: '#003b9a' }}
          onClick={this.handleSliding}
        >
          <AddRoundedIcon />
        </Fab>
        {
          this.state.reqOpen &&
          <RequestDialog
            handleNext={this.handleNext}
            handleClose={this.handleClose}
            updateCandidate={this.updateCandidate}
            updateCandidateAutosuggested={this.updateCandidateAutosuggested}
            updateRequiredInterviewers={this.updateRequiredInterviewers}
            updateOptionalInterviewers={this.updateOptionalInterviewers}
            handleSelectInterviewDuration={this.handleSelectInterviewDuration}
            {...this.state}
          ></RequestDialog>
        }
        {
          this.state.optOpen &&
          <OptionsDialog
            handleOpen={this.handleOpen}
            handleSave={this.handleSave}
            {...this.state}
          ></OptionsDialog>
        }
        {
          this.state.roomOpen &&
          <RoomDialog
            handleCloseAddRoom={this.handleCloseAddRoom}
            handleSaveAddRoom={this.handleSaveAddRoom}
            {...this.state}
          ></RoomDialog>
        }
        {this.showSnackbarOnSuccess()}
      </div >
    );
  }
}
