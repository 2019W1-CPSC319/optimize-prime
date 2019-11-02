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
import { random } from 'node-forge';

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
                { id: 0, name: '100A', seats: 10 },
                { id: 1, name: '101A', seats: 6 },
                { id: 2, name: '102A', seats: 3 },
                { id: 3, name: '200A', seats: 4 },
                { id: 4, name: '200B', seats: 4 },
                { id: 5, name: '202A', seats: 5 },
                { id: 6, name: '300A', seats: 10 },
                { id: 7, name: '301A', seats: 20 },
                { id: 8, name: '302A', seats: 5 },
                { id: 9, name: '302B', seats: 10 },
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

    handleSaveAddRoom = (event) => {
        try {
            event.preventDefault();
            let data = {
                name: event.target[0].value,
                seats: event.target[1].value,
            }
            console.log(data)
            axios.post(`/schedule/room`, data).then(res => {
                console.log(res);
                Swal.fire(
                    'Success',
                    'Successfully added new user',
                    'success'
                );
            }).catch(error => {
                console.error(error);
            });
        }
        catch (err) {
            console.error(JSON.stringify(err));
        }
        this.setState({ roomOpen: false });
        this.setState({ onSuccess: true });
    }

    handleDeleteRoom = (id) => {
        console.log(id);
        try {
            axios.put(`/schedule/room/${id}`).then(res => {
                console.log(res);
                // this.setState({
                //     rooms: res.data
                // });
            }).catch(error => {
                console.error(error);
            });
        }
        catch (err) {
            console.error(JSON.stringify(err));
        }
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
        const { pageProps } = this.props;

        // if (!pageProps.user.profile) {
        //     pageProps.actions.findMeetingTimes();
        // }

        try {
            axios.get('/schedule/rooms').then(res => {
                console.log(res.data)
                this.setState({
                    rooms: res.data
                });
            }).catch(error => {
                console.error(error);
            });
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
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rooms.map(
                                room => {
                                    if (room.status === 'A')
                                        return (
                                            <TableRow key={140}>
                                                <TableCell>{room.name}</TableCell>
                                                <TableCell align="center">{room.seats}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        value={room.roomId}
                                                        color="default"
                                                        variant="outlined"
                                                        onClick={() => this.handleDeleteRoom(room.roomId)}
                                                    >Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    else return <TableRow></TableRow>
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
