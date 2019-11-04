import React, { Component } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2'
import axios from 'axios';
import EventIcon from '@material-ui/icons/Event';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import GroupIcon from '@material-ui/icons/Group';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Typography,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  Paper,
  TextField,
} from '@material-ui/core';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true
})

const styles = theme => ({
  heading: {
    padding: '5px',
    textAlign: 'center',
    borderRadius: '0',
    fontSize: 'small'
  },
  paper: {
    height: 140,
  },
  title: {
    fontWeight: 'normal',
    marginLeft: '30px',
  },
  flex: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  card: {
    margin: '5px auto',
    '&:hover': {
      backgroundColor: '#f9f9f9',
    }
  },
  calendar: {
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
    cursor: 'pointer',
    display: 'flex',
    fontSize: '16px',
    outline: 'none',
    marginTop: '10px',
    marginRight: '25px',
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
  },
  avatar: {
    width: '25px',
    height: '25px',
    fontSize: 'small',
    marginRight: '2px',
    '&:nth-of-type(1)': {
      marginLeft: '2px'
    },
  }
});

class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optOpen: false,
      reqOpen: false,
      value: 'female',
      background: ['#280e3a', '#fff', '#fff', '#fff'],
      color: ['#fff', '#000', '#000', '#000']
    };
  }

  handleOpen() {
    this.setState({ reqOpen: true });
  }

  handleClose() {
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
        this.setState({ reqOpen: false });
        this.setState({ optOpen: false });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.setState({ reqOpen: true });
        this.setState({ optOpen: false });
      }
    })
    this.setState({ reqOpen: false });
    this.setState({ optOpen: false });
  }

  handleNext() {
    const data = {};
    axios.post('schedule/meeting', data);
    this.setState({ reqOpen: false });
    this.setState({ optOpen: true });

  }

  handleBack() {
    this.setState({ reqOpen: true });
    this.setState({ optOpen: false });
  }

  handleDelete() {

  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSelect(selected) {
    const { background, color } = this.state;

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
    return (
      <div>
        <div className={clsx(classes.header, classes.flex)}>
          <h1 className={classes.title}>Calendar</h1>
          <Button className={classes.button} onClick={this.handleOpen.bind(this)} variant="outlined">
            <EventIcon className={classes.icon}></EventIcon>
            <Typography>Schedule Interview</Typography>
          </Button>
        </div>
        <Grid container justify="center" style={{ margin: '20px 10px auto', width: 'calc(100% - 20px)' }}>
          {[
            { value: 'MON', date: 14 },
            { value: 'TUE', date: 15 },
            { value: 'WED', date: 16 },
            { value: 'THU', date: 17 },
            { value: 'FRI', date: 18 },
            { value: 'SAT', date: 19 },
            { value: 'SUN', date: 20 }].map(value => (
              <Grid key={value.value} item style={{ width: 'calc((100% - 0px) / 7)', }}>
                <Paper className={classes.heading}>
                  {value.value}
                  <Typography>{value.date}</Typography>
                </Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
                <Paper style={{ width: '100%', height: '50px', borderRadius: '0' }}></Paper>
              </Grid>
            ))}
        </Grid>
        <Dialog open={this.state.reqOpen} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
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
              placeholder="Enter additional comments"
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
            <Button             
            onClick={() => this.handleNext()} color="primary">
              Next
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.optOpen} aria-labelledby="form-options">
          <DialogTitle id="form-options">Select Interview Slot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select an interview slot to schedule an interview.
              Upon submission, emails will be sent out to the candidate and interviewers.
            </DialogContentText>
            <Card className={clsx(classes.card, classes.flex)}>
              <CardContent>
                <Typography align="center" style={{ fontWeight: 'bold', }}>
                  SEPTEMBER 20, 2019
                </Typography>
                <Typography align="right">2:00 PM - 3:00 PM</Typography>
              </CardContent>
              <CardContent style={{ padding: '0' }}>
                <CardContent style={{ display: 'flex', paddingBottom: '0' }}>
                  <MeetingRoomIcon></MeetingRoomIcon><Typography>Room 2307</Typography>
                </CardContent>
                <CardContent style={{ display: 'flex', paddingTop: '0' }}>
                  <GroupIcon></GroupIcon>
                  <Avatar className={classes.avatar} style={{ backgroundColor: 'darkslateblue' }}>H</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#fcba03' }}>N</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#fc036f' }}>OP</Avatar>
                </CardContent>
              </CardContent>
            </Card>
            <Card className={clsx(classes.card, classes.flex)}>
              <CardContent>
                <Typography align="center" style={{ fontWeight: 'bold' }}>
                  SEPTEMBER 20, 2019
                </Typography>
                <Typography align="right">3:00 PM - 3:30 PM</Typography>
              </CardContent>
              <CardContent style={{ padding: '0' }}>
                <CardContent style={{ display: 'flex', paddingBottom: '0' }}>
                  <MeetingRoomIcon></MeetingRoomIcon><Typography>Room 120</Typography>
                </CardContent>
                <CardContent style={{ display: 'flex', paddingTop: '0' }}>
                  <GroupIcon></GroupIcon>
                  <Avatar className={classes.avatar} style={{ backgroundColor: 'darkslateblue' }}>H</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#fcba03' }}>N</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#fc036f' }}>OP</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#120abc' }}>WT</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#2938da' }}>VS</Avatar>
                </CardContent>
              </CardContent>
            </Card>
            <Card className={clsx(classes.card, classes.flex)}>
              <CardContent>
                <Typography align="center" style={{ fontWeight: 'bold' }}>
                  SEPTEMBER 21, 2019
                </Typography>
                <Typography align="right">12:00 PM - 1:00 PM</Typography>
              </CardContent>
              <CardContent style={{ padding: '0' }}>
                <CardContent style={{ display: 'flex', paddingBottom: '0' }}>
                  <MeetingRoomIcon></MeetingRoomIcon><Typography>Room 2307</Typography>
                </CardContent>
                <CardContent style={{ display: 'flex', paddingTop: '0' }}>
                  <GroupIcon></GroupIcon>
                  <Avatar className={classes.avatar} style={{ backgroundColor: 'darkslateblue' }}>H</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#fcba03' }}>N</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#fc036f' }}>OP</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#f12039' }}>DK</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#fdc0df' }}>J</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: '#123456' }}>QZ</Avatar>
                  <Avatar className={classes.avatar} style={{ backgroundColor: 'mediumseagreen' }}>SP</Avatar>
                  <MoreHorizIcon></MoreHorizIcon>
                </CardContent>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleBack.bind(this)} color="primary">
              Back
            </Button>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(CalendarPage);
