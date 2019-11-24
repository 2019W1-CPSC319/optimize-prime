import React from 'react';
import Swal from 'sweetalert2';
import RoomDialog from './RoomDialog';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import { green } from '@material-ui/core/colors';
import {
  Box,
  Icon,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Fab,
  SnackbarContent,
  Snackbar,
  Button,
} from '@material-ui/core';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true
})

const initialState = {
  roomOpen: false,
  onSuccess: false,
  name: '',
  seats: 0,
  rooms: [],
  error: false,
}

export default class RoomPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  handleOpenAddRoom = () => {
    this.setState({ roomOpen: true });
  }

  handleCloseAddRoom = () => {
    // swalWithBootstrapButtons.fire(
    //     'Cancelled',
    //     'Your progress has not been saved!',
    //     'error'
    // )
    this.setState({ ...initialState });
  }

  handleSaveAddRoom = async () => {
    const { actions } = this.props;
    const { rooms, error } = this.state;
    let addRoomError = false;
    if (!error) {
      try {
        const roomPromises = rooms.map(async room => {
          let data = {
            name: room.name,
            email: this.props.outlookRooms.find(outlookRoom => outlookRoom.name === room.name).address,
            seats: this.state.seats,
          }
          const response = await actions.addRoom(data);
          if (response && response.error) {
            addRoomError = true;
          }
        });
        await Promise.all(roomPromises);
        if (!addRoomError) {
          swalWithBootstrapButtons.fire(
            'Success',
            'Successfully added new interview room(s).',
            'success'
          );
        }
        this.setState({ ...initialState, onSuccess: true });
      } catch (err) {
        console.error(JSON.stringify(err));
      }
    }
  }

  handleDeleteRoom = (id) => {
    const { actions } = this.props;
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then(async (result) => {
      const { value } = result;
      if (value) {
        const response = actions.deleteRoom(id);
        if (response && !response.error) {
          swalWithBootstrapButtons.fire(
            'Deleted',
            'The room has been deleted.',
            'success'
          );
        }
      }
    })
  }

  handleChangeRoomName = (event, value) => {
    this.setState({ rooms: value });
  }

  handleChangeRoomSeats = (event) => {
    event.persist();
    this.setState({ error: event.target.value < 1 || event.target.value >= 100, seats: event.target.value });
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

    await actions.getRooms();
    await actions.getOutlookRooms();
  }

  render() {
    const { rooms } = this.props;
    return (
      <div>
        <h1 style={{ marginLeft: '30px', fontWeight: 'normal' }}>Rooms</h1>
        <Paper style={{ margin: '0 30px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell scope="col">Room Name</TableCell>
                <TableCell scope="col" align="center">Maximum Capacity</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {
                rooms.map(room => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell align="center">{room.seats}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => this.handleDeleteRoom(room.id)}
                      >
                        <Icon style={{ color: '#f0a017' }}>delete</Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Paper>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: 'fixed', right: '30px', bottom: '30px', backgroundColor: '#003b9a' }}
          onClick={this.handleOpenAddRoom}
        >
          <AddRoundedIcon />
        </Fab>
        <RoomDialog
          handleCloseAddRoom={this.handleCloseAddRoom}
          handleSaveAddRoom={this.handleSaveAddRoom}
          handleChangeRoomName={this.handleChangeRoomName}
          handleChangeRoomSeats={this.handleChangeRoomSeats}
          {...this.props}
          {...this.state}
        />
      </div >
    );
  }
}
