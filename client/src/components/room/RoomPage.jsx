import React from 'react';
import Swal from 'sweetalert2';
import RoomDialog from './RoomDialog';
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
    Button,
} from '@material-ui/core';

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
            roomOpen: false,
            onSuccess: false,
            name: '',
            seats: 0,
        };
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
        this.setState({ roomOpen: false });
        this.setState({ name: '' });
        this.setState({ seats: 0 });
    }

    handleSaveAddRoom = async () => {
        const { actions } = this.props;
        try {
            let data = {
                name: this.state.name,
                seats: this.state.seats,
            }
            await actions.addRoom(data);
            swalWithBootstrapButtons.fire(
                'Success',
                'Successfully added new user',
                'success'
            );
            this.setState({ roomOpen: false });
            this.setState({ onSuccess: true });
            this.setState({ name: '' });
            this.setState({ seats: 0 });
        }
        catch (err) {
            console.error(JSON.stringify(err));
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
                actions.deleteRoom(id);
                swalWithBootstrapButtons.fire(
                    'Deleted',
                    'The room has been deleted.',
                    'success'
                );
            }
        })
    }

    handleChangeRoomName = (event) => {
        event.persist();
        this.setState({ name: event.target.value });
    }

    handleChangeRoomSeats = (event) => {
        event.persist();
        this.setState({ seats: event.target.value });
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

        try {
            await actions.getRooms();
        }
        catch (err) {
            console.error(JSON.stringify(err));
        }
    }

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
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.rooms.map(
                                room => {
                                    return (
                                        <TableRow key={room.id}>
                                            <TableCell>{room.name}</TableCell>
                                            <TableCell align="center">{room.seats}</TableCell>
                                            <TableCell>
                                                <Button
                                                    value={room.id}
                                                    color="default"
                                                    variant="outlined"
                                                    onClick={() => this.handleDeleteRoom(room.id)}
                                                >Delete</Button>
                                            </TableCell>
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
                <RoomDialog
                    handleCloseAddRoom={this.handleCloseAddRoom}
                    handleSaveAddRoom={this.handleSaveAddRoom}
                    handleChangeRoomName={this.handleChangeRoomName}
                    handleChangeRoomSeats={this.handleChangeRoomSeats}
                    {...this.state}
                />
                {this.showSnackbarOnSuccess()}
            </div >
        );
    }
}
