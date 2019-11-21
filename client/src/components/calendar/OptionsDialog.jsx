import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {
  Avatar,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Radio,
  Popover,
} from '@material-ui/core';

const styles = {
  schedule: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
  },
  date: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  year: {
    fontSize: '10px',
  },
  month: {
    fontSize: '14px',
  },
  day: {
    fontSize: '16px',
  },
  time: {
    display: 'flex',
    flexDirection: 'column',
  },
  avatar: {
    fontSize: 'x-small',
    width: '20px',
    height: '20px',
    backgroundColor: `${'#' + Math.floor(Math.random() * 16777215).toString(16)}`
  }
};

// TODO: make it a checkbox, instead of radio button to allow multiple selection of events
const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})(props => <Radio color='default' {...props} />);

class OptionsDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      background: props.background,
      color: props.color,
      required: props.required,
      optional: props.optional,
      candidate: props.candidate,
      popover: null,
    };
  }

  // updateRequiredInterviewers = (event) => {
  //   this.setState({ required: event.target.value });
  // }

  // updateOptionalInterviewers = (event) => {
  //   this.setState({ optional: event.target.value });
  // }

  // updateCandidate = (event) => {
  //   this.setState({ candidate: event.target.value });
  // }

  handlePopoverOpen = (event) => {
    this.setState(event.target);
  };

  handlePopoverClose = () => {
    this.setState(null);
  };

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

  createOptions = () => {
    const {
      classes,
      meetingSuggestions,
      selectedOption,
      handleSelectOption,
      schedulesPerPage,
      pageNumber,
    } = this.props;

    if (Array.isArray(meetingSuggestions) && meetingSuggestions.length > 0) {
      const startIndex = schedulesPerPage * pageNumber - schedulesPerPage;
      const endIndex = startIndex + schedulesPerPage;
      const paginatedSchedules = meetingSuggestions.slice(startIndex, endIndex);

      return (
        <List dense>
          {
            paginatedSchedules.map((schedule, index) => {
              return (
                <ListItem key={index}>
                  {
                    schedule.map((option) => {
                      const hash = `${option.start.dateTime}-${option.end.dateTime}-${option.room.displayName}`;
                      const labelId = `radio-list-secondary-label-${hash}`;
                      const date = new Date(option.start.dateTime);
                      const startTime = moment(option.start.dateTime).format('hh:mmA');
                      const endTime = moment(option.end.dateTime).format('hh:mmA')

                      return (
                        <div key={hash} className={classes.schedule}>
                          <div className={classes.date}>
                            <Typography className={classes.year}>{moment(date).format('YYYY')}</Typography>
                            <Typography className={classes.month}>{moment(date).format('MMM')}</Typography>
                            <Typography className={classes.day}>{moment(date).format('DD')}</Typography>
                          </div>
                          <Divider orientation="vertical" />
                          <div className={classes.time}>
                            <Typography>{startTime} - {endTime}</Typography>
                            <Typography>{option.room.displayName}</Typography>
                          </div>
                          <Box component='div' display='flex'>
                            {option.interviewers.map(
                              interviewer => {
                                return (
                                  <Avatar
                                    key={`${interviewer}-${Math.random() * 1000}`}
                                    // onMouseEnter={this.handlePopoverOpen}
                                    // onMouseLeave={this.handlePopoverClose}
                                    className={classes.avatar}>{interviewer.attendee.emailAddress.address.charAt(0).toUpperCase()}</Avatar>
                                )
                              }
                            )}
                          </Box>
                        </div>
                      );
                    })
                  }
                  <ListItemSecondaryAction>
                    <GreenRadio
                      checked={selectedOption === index}
                      onChange={() => handleSelectOption(index)}
                      value={index}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })
          }
        </List>
      );
    } else {
      return (
        <Box style={{ padding: '50px' }}>
          <Typography style={{ textAlign: 'center' }}>
            {Array.isArray(meetingSuggestions) ? 'No options available' : 'Candidate availability has not been submitted'}
          </Typography>
          <Button
            color='primary'
            style={{ display: 'block', margin: 'auto' }}
            onClick={this.props.handleOpen}
          >Go back</Button>
        </Box>
      );
    }

  }

  displayPopover = () => {
    const { classes } = this.props;
    return (
      <Popover
        id='mouse-over-popover'
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(this.state.popover)}
        anchorEl={this.state.popover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={this.handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>I use Popover.</Typography>
      </Popover>
    )
  }

  render() {
    // const { classes } = this.props;
    return (
      <Dialog open={this.props.optOpen} aria-labelledby='form-options'>
        <DialogTitle id='form-options'>Select Interview Slot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an interview slot to schedule an interview.
            Upon submission, emails will be sent out to the candidate and interviewers.
                    </DialogContentText>
          {this.props.meetingSuggestions && this.createOptions()}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleOpen} color='primary'>Back</Button>
          <Button onClick={this.props.handleSave} color='primary'>Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(OptionsDialog);
