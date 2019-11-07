import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    TextField,
} from '@material-ui/core';

const styles = theme => ({
    duration: {
        padding: '5px 30px',
        borderColor: '#765ea8',
    },
    chip: {
        marginRight: '5px',
    },
    avatar: {
        backgroundColor: `${'#' + Math.floor(Math.random() * 16777215).toString(16)}`,
        color: '#fff',
        fontSize: 'xx-small'
    }
});

class RoomDialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <Dialog open={this.props.roomOpen} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add a new room</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a new room, provide all the required fields.
                    </DialogContentText>
                    <TextField
                        required
                        autoFocus={true}
                        id="name"
                        label="Room Name"
                        name="name"
                        value={this.props.name}
                        margin="normal"
                        variant="outlined"
                        onChange={this.props.handleChangeRoomName}
                        fullWidth
                    />
                    <TextField
                        required
                        id="seats"
                        label="Maximum Capacity"
                        margin="normal"
                        variant="outlined"
                        value={this.props.seats || ''}
                        name="seats"
                        onChange={this.props.handleChangeRoomSeats}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><PeopleRoundedIcon /></InputAdornment>,
                        }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleCloseAddRoom} color="primary">Cancel</Button>
                    <Button type="submit" onClick={this.props.handleSaveAddRoom} color="primary">Save</Button>
                </DialogActions>
            </Dialog >
        );
    }
}

export default withStyles(styles)(RoomDialog);
