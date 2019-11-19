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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel
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
    const { classes, meetingSuggestions, handleOpen, selectedOption, handleSelectOption } = this.props;
    // console.log(meetingSuggestions.data.filter(suggestion => suggestion[0].room === undefined))

    if (Array.isArray(meetingSuggestions.data) && meetingSuggestions.data.length > 0) {
      return (
        <List dense>
          {meetingSuggestions.data.map((block, index) => {
            return block.map((option, key) => {
              // const hash = `${option.start}-${option.end}-${option.room.displayName}`;
              // const labelId = `radio-list-secondary-label-${hash}`;
              console.log(option)
              return (
                <ListItem key={key}>
                  <ListItemText
                    // id={labelId}
                    primary={
                      <Box>
                        <Box fontWeight='fontWeightBold'>
                          <Moment
                            subtract={{ hours: 8 }}
                            format='ll'
                            tz='America/Los_Angeles'
                          >
                            {option.start}
                          </Moment>
                        </Box>
                        <Typography>
                          Starts at <Moment subtract={{ hours: 8 }} format='h:mm a' tz='America/Los_Angeles'> {option.start}</Moment>
                        </Typography>
                        <Typography>
                          Ends at <Moment subtract={{ hours: 8 }} format='h:mm a' tz='America/Los_Angeles'> {option.end}</Moment>
                        </Typography>
                      </Box>
                    }
                    secondary={option.room.displayName}
                  />
                  <Box component='div' display='flex'>
                    {option.required.map(
                      interviewer => {
                        return (
                          <Avatar
                            key={`${interviewer}-${Math.random() * 1000}`}
                            // onMouseEnter={this.handlePopoverOpen}
                            // onMouseLeave={this.handlePopoverClose}
                            className={classes.avatar}
                          >
                            {interviewer.charAt(0).toUpperCase()}
                          </Avatar>
                        )
                      }
                    )}
                    {option.optional.map(
                      interviewer => {
                        return (
                          <Avatar
                            key={`${interviewer}-${Math.random() * 1000}`}
                            // onMouseEnter={this.handlePopoverOpen}
                            // onMouseLeave={this.handlePopoverClose}
                            className={classes.avatar}
                          >
                            {interviewer.charAt(0).toUpperCase()}
                          </Avatar>
                        )
                      }
                    )}
                  </Box>
                  <ListItemSecondaryAction>
                    <GreenRadio
                      checked={selectedOption === key}
                      onChange={() => handleSelectOption(key)}
                      value={key}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            });
          })}
        </List>
      );
    } else {
      return (
        <Box style={{ padding: '50px' }}>
          <Typography style={{ textAlign: 'center' }}>
            {Array.isArray(meetingSuggestions.data) ? 'No options available' : 'Candidate availability has not been submitted'}
          </Typography>
          <Button
            color='primary'
            style={{ display: 'block', margin: 'auto' }}
            onClick={handleOpen}
          >Go back</Button>
        </Box>
      );
    }

  }

  displayPopover = () => {
    const { classes } = this.props;
    const { popover } = this.state;
    return (
      <Popover
        id='mouse-over-popover'
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(popover)}
        anchorEl={popover}
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
    const { optOpen, meetingSuggestions, handleOpen, handleSave, classes, handleSelectOption } = this.props;
    return (
      <Dialog open={optOpen} aria-labelledby='form-options'>
        <DialogTitle id='form-options'>Select Interview Slot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an interview slot to schedule an interview.
            Upon submission, emails will be sent out to the candidate and interviewers.
          </DialogContentText>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup aria-label="gender" name="gender1" value={0} onChange={handleSelectOption}>
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
              <FormControlLabel
                value="disabled"
                disabled
                control={<Radio />}
                label="(Disabled option)"
              />
            </RadioGroup>
          </FormControl>
          {meetingSuggestions && this.createOptions()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen} color='primary'>Back</Button>
          <Button onClick={handleSave} color='primary'>Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(OptionsDialog);
