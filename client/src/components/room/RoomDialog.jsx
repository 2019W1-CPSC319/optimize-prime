import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
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

class RoomDialog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, rooms, seats } = this.props;
    return (
      <Dialog open={this.props.roomOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a new room</DialogTitle>
        <DialogContent>
          <DialogContentText>To add a new room, provide all the required fields.</DialogContentText>
          <Autocomplete
            required
            multiple
            options={this.props.outlookRooms}
            getOptionLabel={option => option.name}
            filterSelectedOptions
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label="Available room(s)"
                margin="normal"
                fullWidth
              />
            )}
            value={rooms}
            onChange={this.props.handleChangeRoomName}
          />
          <TextField
            required
            id="seats"
            label="Maximum Capacity"
            margin="normal"
            variant="outlined"
            type="number"
            value={this.props.seats || ''}
            name="seats"
            helperText="Should fall between 1 and 100"
            onChange={this.props.handleChangeRoomSeats}
            InputProps={{
              endAdornment: <InputAdornment position="end"><PeopleRoundedIcon /></InputAdornment>,
            }}
            error={this.props.error}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleCloseAddRoom} color="primary">Cancel</Button>
          <Button
            disabled={!rooms || rooms.length === 0 || !seats}
            type="submit"
            onClick={this.props.handleSaveAddRoom}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog >
    );
  }
}

export default withStyles(styles)(RoomDialog);
