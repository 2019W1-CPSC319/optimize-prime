import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Radio,
  Popover,
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
    fontSize: 'x-small',
    width: '20px',
    height: '20px',
    backgroundColor: `${'#' + Math.floor(Math.random() * 16777215).toString(16)}`
  }
});

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
    const { classes, meetingSuggestions } = this.props;

    if (Array.isArray(meetingSuggestions) && meetingSuggestions.length > 0) {
      return (
        <List dense>
          {
            meetingSuggestions.map((schedule) => {
              return (
                <ListItem>
                  {
                    schedule.map((option, index) => {
                      const hash = `${option.start.dateTime}-${option.end.dateTime}-${option.room.displayName}`;
                      const labelId = `radio-list-secondary-label-${hash}`;
                      return (
                        <ListItem key={hash}>
                          <ListItemSecondaryAction>
                            <GreenRadio
                              checked={this.props.selectedOption === index}
                              onChange={() => this.props.handleSelectOption(index)}
                              value={index}
                            />
                          </ListItemSecondaryAction>
                          <ListItemText
                            id={labelId}
                            primary={
                              <Box>
                                <Box fontWeight='fontWeightBold'><Moment subtract={{ hours: 8 }} format='ll' tz='America/Los_Angeles'>{option.start.dateTime}</Moment></Box>
                                <Typography>Starts at <Moment subtract={{ hours: 8 }} format='h:mm a' tz='America/Los_Angeles'>{option.start.dateTime}</Moment></Typography>
                                <Typography>Ends at <Moment subtract={{ hours: 8 }} format='h:mm a' tz='America/Los_Angeles'>{option.end.dateTime}</Moment></Typography>
                              </Box>
                            }
                            secondary={option.room.displayName} />
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
                        </ListItem>
                      );
                    })
                  }
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
