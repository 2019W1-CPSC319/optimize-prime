import React, { Component } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import {
  Avatar,
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
} from '@material-ui/core';

const styles = theme => ({
  title: {
    fontDuration: 'normal',
    marginLeft: '30px',
  },
  flex: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  calendar: {
    // margin: '0 10px',
    height: '700px',
  },
  component: {
    width: 'calc(100% / 7)',
    color: '#fff',
    height: 'fit-content',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      width: 'inherit',
    },
  },
  label: {
    padding: '7.5px 0',
    backgroundColor: '#280e3a',
    margin: '0',
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
    justifyContent: 'space-between',
  },
  button: {
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '16px',
    outline: 'none',
    [theme.breakpoints.down('sm')]: {
      margin: 'auto',
    },
  },
  icon: {
    margin: 'auto',
  },
  iconLabel: {
    marginLeft: '10px',
    marginRight: '30px',
  },
  duration: {
    padding: '5px 30px',
    borderColor: '#765ea8',
  }
});

class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      background: ['#280e3a', '#fff', '#fff', '#fff'],
      color: ['#fff', '#000', '#000', '#000']
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

  handleChange() {

  }

  handleSelect(selected) {
    let background = this.state.background;
    let color = this.state.color;

    for (let i = 0; i < 4; i++)
      if (i === selected) {
        background[i] = '#280e3a';
        color[i] = '#fff';
      }
      else {
        background[i] = '#fff';
        color[i] = '#280e3a';
      }

    this.setState({ background: background });
  }

  render() {
    const { classes } = this.props;
    return <div>
      <div className={clsx(classes.header, classes.flex)}>
        <h1 className={classes.title}>Calendar</h1>
        <Button className={classes.button} onClick={this.handleOpen.bind(this)}>
          <EventIcon className={classes.icon}></EventIcon>
          <p>Schedule Interview</p>
        </Button>
      </div>
      <Paper style={{ margin: '17px 10px auto' }} square>
        <div className={clsx(classes.calendar, classes.flex)}>
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
      </Paper>
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
            margin="dense"
            id="required-interviewers"
            label="Required Interviewer(s)"
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
          <TextField
            margin="dense"
            id="optional-interviewers"
            label="Optional Interviewer(s)"
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
          <div style={{ margin: '5px 5px 10px' }}>
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
          </div>
          <Grid item>
            <ButtonGroup fullWidth size="small" aria-label="small outlined button group">
              <Button
                className={classes.duration}
                style={{
                  background: this.state.background[0],
                  color: this.state.color[0]
                }}
                onClick={this.handleSelect.bind(this, 0)}>
                30 min
              </Button>
              <Button
                className={classes.duration}
                style={{
                  background: this.state.background[1],
                  color: this.state.color[1]
                }}
                onClick={this.handleSelect.bind(this, 1)}>
                45 min
              </Button>
              <Button
                className={classes.duration}
                style={{
                  background: this.state.background[2],
                  color: this.state.color[2]
                }}
                onClick={this.handleSelect.bind(this, 2)}>
                60 min
              </Button>
              <Button
                className={classes.duration}
                style={{
                  background: this.state.background[3],
                  color: this.state.color[3]
                }}
                onClick={this.handleSelect.bind(this, 3)}>
                90 min
              </Button>
            </ButtonGroup>
          </Grid>
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
