import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Chip,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Fab,
  MenuItem,
  Input,
  InputAdornment,
  InputLabel,
  Select,
  TextField,
  List,
  ListItem,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography
} from '@material-ui/core';
import { FIELD_DURATION, FIELD_REQUIRED, FIELD_PROFILE } from './CalendarPage';

const styles = theme => ({
  duration: {
    padding: '15px 30px',
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
  },
  fabAdd: {
    borderRadius: "4px",
    backgroundColor: "#4CAF50",
  },
  submitBtn: {
    borderRadius: "4px",
    margin: "30px 30px",
  },
  timeSelector: {
    minWidth: "120px"
  },
  datePicker: {
    minWidth: "120px"
  }
});

class RequestDialog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, candidates, interviewers, rows, reqOpen, durations, selected } = this.props;
    return (
      <Dialog open={reqOpen} aria-labelledby="form-dialog-title" fullWidth maxWidth="lg">
        <DialogTitle id="form-dialog-title">Schedule Interview</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To schedule a new interview, provide a candidate and a list of interviewers to request a list of options.
          </DialogContentText>
          <Autocomplete
            autoFocus
            options={candidates}
            getOptionLabel={candidate => candidate.email}
            style={{ width: 300 }}
            renderInput={params => (
              <TextField {...params} label="Candidate" variant="outlined" fullWidth />
            )}
            style={{ width: '100%' }}
            autoComplete={false}
            // value={this.props.candidate}
            onChange={this.props.updateCandidate}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Interviewer</TableCell>
                <TableCell>Required?</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {/* <Autocomplete
                      multiple
                      options={interviewers}
                      getOptionLabel={option => option.email}
                      filterSelectedOptions
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Required interviewer(s)"
                          margin="normal"
                          fullWidth
                        />
                      )}
                      onChange={this.props.updateRequiredInterviewers}
                    /> */}
                    <Autocomplete
                      autoFocus
                      options={interviewers}
                      getOptionLabel={interviewer => interviewer.email}
                      // style={{ width: 300 }}
                      renderInput={params => (
                        <TextField {...params} label="Interviewer" variant="outlined" fullWidth />
                      )}
                      // style={{ width: '100%' }}
                      autoComplete={false}
                      value={row}
                      onChange={(event) => this.props.handleSelectorChange(event, index, FIELD_PROFILE)}
                    // onChange={this.props.updateInterviewer}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.required}
                      onChange={(event) => this.props.handleSelectorChange(event, index, FIELD_REQUIRED)}
                      value="required"
                      inputProps={{
                        'aria-label': 'primary checkbox',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      // labelId="demo-simple-select-label"
                      // id="demo-simple-select"
                      value={row.duration}
                      onChange={(event) => this.props.handleSelectorChange(event, index, FIELD_DURATION)}
                    >
                      <MenuItem value={30}>0.5 hour</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={90}>1.5 hours</MenuItem>
                      <MenuItem value={120}>2 hours</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => { this.props.handleRemoveRow(index) }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length > 0 && <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Fab
                    aria-label="add"
                    size="small"
                    onClick={this.props.handleAddRow}
                    className={classes.fabAdd}>
                    <AddIcon />
                  </Fab>
                </TableCell>
              </TableRow>}
            </TableBody>
          </Table>
          {rows.length === 0 &&
            <Box>
              <Typography
                // variant='h5'
                align='center'
                style={{ margin: '100px auto' }}
              >
                No interviewer
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.props.handleAddRow}
                style={{ margin: 'auto', display: 'block' }}
              >
                Add
              </Button>
            </Box>
          }
          {/* <ButtonGroup fullWidth size="small" aria-label="small outlined button group" className={classes.buttonGroup}>
            {durations.map(
              (duration, i) => {
                return (
                  <Button key={i} className={classes.duration}
                    style={{
                      background: `${selected == i ? '#280e3a' : '#fff'}`,
                      color: `${selected == i ? '#fff' : '#280e3a'}`
                    }}
                    onClick={() => this.props.handleSelectInterviewDuration(i)}>{duration.minutes} min</Button>
                )
              }
            )}
          </ButtonGroup> */}
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
