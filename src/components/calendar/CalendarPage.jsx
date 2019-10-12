import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField,
} from '@material-ui/core';

const styles = {
  title: {
    fontWeight: 'normal',
    marginLeft: '30px',
  },
  calendar: {
    display: 'flex',
    margin: '0 10px',
    height: '700px',
  },
  component: {
    width: 'calc(100% / 7)',
    textAlign: 'center',

    color: '#fff',
    height: 'fit-content',
  },
  label: {
    padding: '7.5px 0',
    backgroundColor: '#280e3a',
  },
  bar: {
    width: '5px',
    height: '84px',
    backgroundColor: '#e91e63',
    borderRadius: '15px',
  },
  detail: {
    color: '#000',
    fontSize: '12px',
    textAlign: 'left',
    lineHeight: '1',
    marginLeft: '10px',
  },
  event: {
    display: 'flex',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '16px',
    outline: 'none',
  },
  icon: {
    margin: 'auto',
  },
  iconLabel: {
    marginLeft: '10px',
    marginRight: '30px',
  }
};

class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleDelete() {

  }

  render() {
    const { classes } = this.props;

    return <div>
      <div className={classes.header}>
        <h1 className={classes.title}>Calendar</h1>
        <Button className={classes.button} onClick={this.handleOpen.bind(this)}>
          <EventIcon className={classes.icon}></EventIcon>
          <p>Schedule Interview</p>
        </Button>
      </div>
      <div className={classes.calendar}>
        {/* Mock data for scheduled interview blocks */}
        <div className={classes.component}>
          <p className={classes.label}>Sunday</p>
          <div className={classes.event}>
            <div className={classes.bar}></div>
            <div className={classes.detail}>
              <p>2:00 PM - 2:45 PM</p>
              <p>John Doe</p>
              <p>UI/UX Team</p>
            </div>
          </div>
        </div>
        <div className={classes.component}><p className={classes.label}>Monday</p></div>
        <div className={classes.component}><p className={classes.label}>Tuesday</p></div>
        <div className={classes.component}><p className={classes.label}>Wednesday</p></div>
        <div className={classes.component}><p className={classes.label}>Thursday</p></div>
        <div className={classes.component}><p className={classes.label}>Friday</p></div>
        <div className={classes.component}><p className={classes.label}>Saturday</p></div>
      </div>
      {/* Mock data for scheduling an interview */}
      <Dialog open={this.state.open} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Schedule Interview</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To schedule a new interview, provide a candidate and a list of interviewers to request a list of options.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="candidate"
            label="Candidate"
            type="email"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            // autoFocus
            margin="dense"
            id="interviewers"
            label="Interviewer(s)"
            type="text"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <span style={{ color: 'rgba(0, 0, 0, 0.54)', margin: 'auto 10px', fontSize: 'small' }}>CC to:</span>
          <Chip
            avatar={<Avatar style={{ backgroundColor: '#fc036f', color: '#fff' }}>AW</Avatar>}
            label="Alice Wang"
            onDelete={this.handleDelete}
            deleteIcon={<HighlightOffRoundedIcon />}
            style={{ backgroundColor: '#fff' }}
          />
          <Chip
            avatar={<Avatar style={{ backgroundColor: '#033dfc', color: '#fff' }}>DK</Avatar>}
            label="David Kennedy"
            onDelete={this.handleDelete}
            deleteIcon={<HighlightOffRoundedIcon />}
            style={{ backgroundColor: '#fff' }}
          />
          <Chip
            avatar={<Avatar style={{ backgroundColor: '#fcba03', color: '#fff' }}>JS</Avatar>}
            label="Jason Song"
            onDelete={this.handleDelete}
            deleteIcon={<HighlightOffRoundedIcon />}
            style={{ backgroundColor: '#fff' }}
          />
          <TextField
            id="filled-full-width"
            label="Additional comments"
            // style={{ margin: 8 }}
            placeholder="Enter additional comments"
            // helperText="Full width!"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose.bind(this)} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClose.bind(this)} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>;
  }
}

export default withStyles(styles)(CalendarPage);
