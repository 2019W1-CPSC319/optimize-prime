import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  MenuItem,
  Select,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography
} from '@material-ui/core';

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

    if (!rows) return null;

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
            autoComplete={false}
            value={this.props.candidate}
            onChange={this.props.updateCandidate}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Required</TableCell>
                <TableCell>Optional</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Autocomplete
                      multiple
                      options={interviewers}
                      getOptionLabel={interviewer => interviewer.email}
                      filterSelectedOptions
                      renderInput={params => (
                        <TextField {...params} label="Required interviewer(s)" variant="outlined" fullWidth />
                      )}
                      autoComplete={false}
                      value={row.required}
                      onChange={(event, value) => this.props.handleAutocompleteChange(event, value, index, 'required')}
                    />
                  </TableCell>
                  <TableCell>
                    <Autocomplete
                      multiple
                      options={interviewers}
                      getOptionLabel={interviewer => interviewer.email}
                      filterSelectedOptions
                      renderInput={params => (
                        <TextField {...params} label="Optional interviewer(s)" variant="outlined" fullWidth />
                      )}
                      autoComplete={false}
                      value={row.optional}
                      onChange={(event, value) => this.props.handleAutocompleteChange(event, value, index, 'optional')}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.duration}
                      onChange={(event) => this.props.handleSelectorChange(event, index, 'duration')}
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
            </Box>}
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
