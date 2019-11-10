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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Input
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
    },
    inputlabel: {
        fontSize: '12px',
        lineHeight: '30px'
    },
    select: {
        border: '1px solid rgba(0, 0, 0, 0.25)',
        borderRadius: '5px',
        paddingTop: '5px',
    },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

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
                    <FormControl
                        fullWidth
                        variant="outlined">
                        <InputLabel
                            htmlFor="select-multiple-chip"
                            className={classes.inputlabel}>
                            Available room(s)</InputLabel>
                        <Select
                            value={this.props.name}
                            onChange={this.props.handleChangeRoomName}
                            input={<Input id="select-chip" disableUnderline={true} />}
                            renderValue={selected => (
                                <Chip key={selected} label={selected} className={classes.chip} />
                            )}
                            MenuProps={MenuProps}
                            className={classes.select}
                        >
                            {this.props.outlookRooms && this.props.outlookRooms.map(room => (
                                <MenuItem key={room.name} value={room.name}>{room.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
