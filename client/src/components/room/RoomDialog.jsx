import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import PersonIcon from '@material-ui/icons/Person';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';
import {
    Avatar,
    Button,
    ButtonGroup,
    FormControl,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    MenuItem,
    Input,
    InputAdornment,
    InputLabel,
    Select,
    TextField,
    List,
    ListItem,
    Paper
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
                        id="name"
                        label="Room Name"
                        placeholder="100A"
                        name="name"
                        value={this.props.name}
                        // className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        onChange={this.props.handleChangeRoomName}
                        fullWidth
                    />
                    <TextField
                        id="seats"
                        label="Maximum Capacity"
                        // className={clsx(classes.margin, classes.textField)}
                        margin="normal"
                        variant="outlined"
                        value={this.props.seats}
                        placeholder="10"
                        name="seats"
                        // onChange={handleChange('weight')}
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
