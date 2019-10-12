import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

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
  // galvanize: {
  //   backgroundColor: '#280e3a',
  // },
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

  render() {
    const { classes } = this.props;

    return <div>
      <div className={classes.header}>
        <h1 className={classes.title}>Calendar</h1>
        <Button className={classes.button} onClick={this.handleOpen.bind(this)}>
          <EventIcon className={classes.icon}></EventIcon>
          <p className={classes.iconLabel}>Schedule Interview</p>
        </Button>
      </div>
      <div className={classes.calendar}>
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
      <Dialog open={this.state.open} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
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
