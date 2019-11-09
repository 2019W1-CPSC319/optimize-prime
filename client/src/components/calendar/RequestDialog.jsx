import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import {
  Avatar,
  Button,
  ButtonGroup,
  FormControl,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Input,
  InputAdornment,
  InputLabel,
  Select,
  TextField,
  List,
  ListItem,
  Paper
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
  buttonGroup: {
    marginTop: '16px'
  }
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

// const employees = [
//   { email: 'jerry.jim@ubc.ca' },
// ];

const candidates = [
  'alice.kim@gmail.com',
];

class RequestDialog extends Component {
  constructor(props) {
    super(props);
  }

  Autosuggest = () => {
    return (
      <Paper style={{ padding: '0' }} square>
        <List style={{ padding: '0' }} dense>
          {candidates.map((name, i) => {
            const input = this.props.candidate.toLowerCase();
            return (
              input !== ''
              && name.toLowerCase().includes(input)
              && name.toLowerCase() !== input
              && <ListItem key={i}><Button value={name} onClick={this.props.updateCandidateAutosuggested}>{name}</Button></ListItem>
            )
          })}
        </List>
      </Paper>
    );
  }

  render() {
    const { classes } = this.props;
    const Autosuggest = this.Autosuggest;
    return (
      <Dialog open={this.props.reqOpen} aria-labelledby="form-dialog-title">
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
            autoComplete="off"
            value={this.props.candidate}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            onChange={this.props.updateCandidate}
            fullWidth
          />
          <Autosuggest />
          <FormControl
            fullWidth
            variant="outlined">
            <InputLabel
              htmlFor="select-multiple-chip"
              className={classes.inputlabel}>
              Required Interviewer(s)</InputLabel>
            <Select
              multiple
              value={this.props.required}
              onChange={this.props.updateRequiredInterviewers}
              input={<Input id="select-multiple-chip" disableUnderline={true} />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip
                      key={value.email}
                      label={value.email}
                      className={classes.chip}
                      avatar={<Avatar className={classes.avatar}>{value.email.charAt(0).toUpperCase()}</Avatar>} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
              className={classes.select}
            >
              {this.props.interviewers && this.props.interviewers.map(employee => (
                <MenuItem key={employee.email} value={employee}>{employee.email}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined">
            <InputLabel
              htmlFor="select-multiple-chip"
              className={classes.inputlabel}>
              Optional Interviewer(s)</InputLabel>
            <Select
              multiple
              value={this.props.optional}
              onChange={this.props.updateOptionalInterviewers}
              input={<Input id="select-multiple-chip" disableUnderline={true} />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip
                      key={value.email}
                      label={value.email}
                      className={classes.chip}
                      avatar={<Avatar className={classes.avatar}>{value.email.charAt(0).toUpperCase()}</Avatar>} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
              className={classes.select}
            >
              {this.props.interviewers && this.props.interviewers.map(employee => (
                <MenuItem key={employee.email} value={employee}>{employee.email}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <ButtonGroup fullWidth size="small" aria-label="small outlined button group" className={classes.buttonGroup}>
            {this.props.durations.map(
              (duration, i) => {
                return (
                  <Button key={i} className={classes.duration}
                    style={{
                      background: `${this.props.selected == i ? '#280e3a' : '#fff'}`,
                      color: `${this.props.selected == i ? '#fff' : '#280e3a'}`
                    }}
                    onClick={() => this.props.handleSelectInterviewDuration(i)}>{duration.minutes} min</Button>
                )
              }
            )}
          </ButtonGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">Cancel</Button>
          <Button onClick={this.props.handleNext} color="primary">Next</Button>
        </DialogActions>
      </Dialog >
    );
  }
}

export default withStyles(styles)(RequestDialog);
