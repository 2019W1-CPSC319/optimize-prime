import React, { Component } from 'react';
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
  List,
  ListItem,
  ListItemText,
  Typography,
  Radio,
  Paper,
  Popover,
  MenuItem,
  Select,
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
    backgroundColor: 'orange'
  }
});

const GreenRadio = withStyles({
  root: {
    color: green[400],
    marginLeft: '15px',
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

  enableSelect = (data) => {
    return Array.isArray(data) && data.length > 0;
  }

  createOptions = () => {
    const { classes, meetingSuggestions, handleOpen, selectedOption, selectedRooms, handleSelect } = this.props;

    if (this.enableSelect(meetingSuggestions.data)) {
      return (
        <List dense>
          {meetingSuggestions.data
            .slice(0, 20)
            .filter(suggestion => suggestion !== null)
            .map((block, value) => {
              return (
                <Paper
                  key={value}
                  style={{ marginBottom: '20px' }}>
                  <GreenRadio
                    checked={selectedOption === value}
                    onChange={() => handleSelect('selectedOption', value)}
                    value={value}
                  />
                  <Box style={{ width: '100%' }}>
                    {block.map((option, key) => {
                      return (
                        <ListItem key={key}>
                          <ListItemText
                            primary={
                              <Box>
                                <Box fontWeight='fontWeightBold'>{moment(option.start).format('MMM DD, YYYY')}</Box>
                                <Typography>Starts at {moment(option.start).format('h:mm A')}</Typography>
                                <Typography>Ends at {moment(option.end).format('h:mm A')}</Typography>
                              </Box>
                            }
                          />
                          <Select
                            value={selectedRooms[`${value}-${key}`] || 0}
                            onChange={(event) => handleSelect('selectedRooms', { ...selectedRooms, [`${value}-${key}`]: event.target.value })}
                          >
                            {option.room.map((room, key) => (
                              <MenuItem
                                key={key}
                                value={key}
                              >
                                {room.displayName}
                              </MenuItem>
                            ))}
                          </Select>
                          <Box component='div' display='flex'>
                            {option.required.map(
                              (interviewer, key) => {
                                return (
                                  <Avatar
                                    key={key}
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
                              (interviewer, key) => {
                                return (
                                  <Avatar
                                    key={key}
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
                        </ListItem>
                      );
                    })}
                  </Box>
                </Paper>
              );
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
    const { optOpen, meetingSuggestions, handleOpen, handleSave } = this.props;
    return (
      <Dialog open={optOpen} aria-labelledby='form-options'>
        <DialogTitle id='form-options'>Select Interview Slot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an interview slot to schedule an interview.
            Upon submission, emails will be sent out to the candidate and interviewers.
          </DialogContentText>
          {meetingSuggestions && this.createOptions()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen} color='primary'>Back</Button>
          <Button onClick={handleSave} color='primary' disabled={!meetingSuggestions || !this.enableSelect(meetingSuggestions.data)}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(OptionsDialog);
