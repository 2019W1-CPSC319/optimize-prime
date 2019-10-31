import React from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';
import axios from 'axios';
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
    Button,
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

export default class RoomPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rooms: [
                { id: 0, name: '100A', capacity: 10 },
                { id: 1, name: '101A', capacity: 6 },
                { id: 2, name: '102A', capacity: 3 },
                { id: 3, name: '200A', capacity: 4 },
                { id: 4, name: '200B', capacity: 4 },
                { id: 5, name: '202A', capacity: 5 },
                { id: 6, name: '300A', capacity: 10 },
                { id: 7, name: '301A', capacity: 20 },
                { id: 8, name: '302A', capacity: 5 },
                { id: 9, name: '302B', capacity: 10 },
            ],
            roomOpen: false,
            onSuccess: false,
        };
    }

    handleOpenAddRoom = () => {
        this.setState({ roomOpen: true });
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

    handleSaveAddRoom = () => {
        this.setState({ roomOpen: false });
        this.setState({ onSuccess: true });
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
                <h1 style={{ marginLeft: '30px', fontWeight: 'normal' }}>Room</h1>
                <Paper square>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell scope="col">Room Name</TableCell>
                                <TableCell scope="col" align="center">Maximum Capacity</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rooms.map(
                                function (room) {
                                    return (
                                        <TableRow key={room.id}>
                                            <TableCell>{room.name}</TableCell>
                                            <TableCell align="center">{room.capacity}</TableCell>
                                            <TableCell><Button value={room.id} color="default" variant="outlined">Delete</Button></TableCell>
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
                    onClick={this.handleOpenAddRoom}
                >
                    <AddRoundedIcon />
                </Fab>
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
