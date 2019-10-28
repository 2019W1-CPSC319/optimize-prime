import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import PersonIcon from '@material-ui/icons/Person';
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
                        id="outlined-required"
                        label="Room Name"
                        // className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleCloseAddRoom} color="primary">Cancel</Button>
                    <Button onClick={this.props.handleSaveAddRoom} color="primary">Save</Button>
                </DialogActions>
            </Dialog >
        );
    }
}

export default withStyles(styles)(RoomDialog);
