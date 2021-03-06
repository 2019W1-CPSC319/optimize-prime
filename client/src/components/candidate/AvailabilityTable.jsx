import React, { Component } from 'react';

import { withStyles } from "@material-ui/core/styles"
// Material UI
import {
  Table, TableBody, TableHead, TableCell, TableRow,
  Select, MenuItem, Button, FormControl, FormHelperText, Typography,
} from "@material-ui/core"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"

import Swal from 'sweetalert2'

// Date Picker
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';

const FIELD_FROM = 1;
const FIELD_TO = 2;

const times = [
  <MenuItem key={0} value={9}>9:00am</MenuItem>,
  <MenuItem key={1} value={9.25}>9:15am</MenuItem>,
  <MenuItem key={2} value={9.5}>9:30am</MenuItem>,
  <MenuItem key={3} value={9.75}>9:45am</MenuItem>,

  <MenuItem key={4} value={10}>10:00am</MenuItem>,
  <MenuItem key={5} value={10.25}>10:15am</MenuItem>,
  <MenuItem key={6} value={10.5}>10:30am</MenuItem>,
  <MenuItem key={7} value={10.75}>10:45am</MenuItem>,

  <MenuItem key={8} value={11}>11:00am</MenuItem>,
  <MenuItem key={9} value={11.25}>11:15am</MenuItem>,
  <MenuItem key={10} value={11.5}>11:30am</MenuItem>,
  <MenuItem key={11} value={11.75}>11:45am</MenuItem>,

  <MenuItem key={12} value={12}>12:00pm</MenuItem>,
  <MenuItem key={13} value={12.25}>12:15pm</MenuItem>,
  <MenuItem key={14} value={12.5}>12:30pm</MenuItem>,
  <MenuItem key={15} value={12.75}>12:45pm</MenuItem>,

  <MenuItem key={16} value={13}>1:00pm</MenuItem>,
  <MenuItem key={17} value={13.25}>1:15pm</MenuItem>,
  <MenuItem key={18} value={13.5}>1:30pm</MenuItem>,
  <MenuItem key={19} value={13.75}>1:45pm</MenuItem>,

  <MenuItem key={20} value={14}>2:00pm</MenuItem>,
  <MenuItem key={21} value={14.25}>2:15pm</MenuItem>,
  <MenuItem key={22} value={14.5}>2:30pm</MenuItem>,
  <MenuItem key={23} value={14.75}>2:45pm</MenuItem>,

  <MenuItem key={24} value={15}>3:00pm</MenuItem>,
  <MenuItem key={25} value={15.25}>3:15pm</MenuItem>,
  <MenuItem key={26} value={15.5}>3:30pm</MenuItem>,
  <MenuItem key={27} value={15.75}>3:45pm</MenuItem>,

  <MenuItem key={28} value={16}>4:00pm</MenuItem>,
  <MenuItem key={29} value={16.25}>4:15pm</MenuItem>,
  <MenuItem key={30} value={16.5}>4:30pm</MenuItem>,
  <MenuItem key={31} value={16.75}>4:45pm</MenuItem>,

  <MenuItem key={32} value={17}>5:00pm</MenuItem>,
  <MenuItem key={33} value={17.25}>5:15pm</MenuItem>,
  <MenuItem key={34} value={17.5}>5:30pm</MenuItem>,
  <MenuItem key={35} value={17.75}>5:45pm</MenuItem>
]

const styles = {
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
}

class AvailabilityTable extends Component {

  constructor(props) {
    super(props);

    // Used for date validation
    const twoDaysFuture = new Date();
    twoDaysFuture.setHours(0, 0, 0, 0);
    twoDaysFuture.setDate(twoDaysFuture.getDate() + 2);

    this.state = {
      indexctr: 1,
      rows: [this.createRow(0, twoDaysFuture, 9, 17)],
      submitHandler: props.submitHandler,
      twoDaysFuture: twoDaysFuture
    };
  }

  getDateAsWeekString = (date) => {
    const day = ["Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"][date.getDay()];
    const month = ["January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"][date.getMonth()]
    return day + ", " + date.getDate() + " " + month + ".";
  }

  getBlockLengthAsString = (row) => {
    const difference = row.to - row.from;
    return Math.floor(difference) + " hours, " + (difference % 1 * 60) + " minutes long."
  }

  handleAddRow = () => {
    // Adds a row to the table
    const row = this.createRow(this.state.indexctr, this.state.twoDaysFuture, 9, 17);
    const newindex = this.state.indexctr + 1;
    this.setState({ indexctr: newindex, rows: [...this.state.rows, row] });
  }

  handleRemoveRow = (id) => {
    // Removes the row with the specified id in the table
    const rows = this.state.rows;
    for (const row of rows) {
      if (row.id == id) {
        rows.splice(rows.indexOf(row), 1);
      }
    }
    this.setState({ rows: rows });
  }

  createRow(id, date, from, to) {
    return { id, date, from, to, dateValid: true, timeValid: true };
  }

  /**
   * Handler for selecting different times in the to or from fields.
   */
  handleSelectorChange = (event) = (event, id, field) => {
    const rows = this.state.rows;
    for (const row of rows) {
      if (row.id == id) {
        if (field == FIELD_FROM) {
          row.from = event.target.value;
        } else {
          row.to = event.target.value;
        }
        row.timeValid = row.from < row.to;
      }
    }
    this.setState(rows);
  }

  /**
   * Handler for submit button
   */
  handleDateChange = (event) = (date, id) => {
    const rows = this.state.rows;
    rows[id].date = date;
    rows[id].dateValid = rows[id].date >= this.state.twoDaysFuture;
    this.setState({ rows: rows });
  }

  /**
   * WARNING ABOUT TIMEZONES!
   * ------------------------------
   * It is currently assumed that all users will be on a system set to pacific
   * time. If a user was to select their availability from a different time
   * zone it would give their availability in that time zone, not in pacific
   * time which the office was in. 
   * Eg if you submitted 9am-5pm from eastern time it would be converted to
   * 6am-2pm in pacific time and then used by the system.
   */
  handleSubmit = () => {
    var times = [];
    for (const row of this.state.rows) {

      // Validate the input, and show an error message if its invalid
      if (!row.dateValid || !row.timeValid) {
        const title = "Theres an issue with your availability!";
        const description = "It looks like the problem is with the the " +
          (row.dateValid ? "time" : "date") +
          " on row " + (this.state.rows.indexOf(row) + 1) + ".";
        Swal.fire(title, description, "error");
        return;
      }

      const start = new Date(row.date.getFullYear(),
        row.date.getMonth(),
        row.date.getDate(),
        row.from - 8,
        (row.from % 1) * 60)
      const end = new Date(row.date.getFullYear(),
        row.date.getMonth(),
        row.date.getDate(),
        row.to - 8,
        (row.to % 1) * 60)
      times.push({ start: start, end: end });
    }
    this.state.submitHandler(times);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Table aria-label="Availability">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <FormControl error={!row.dateValid}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} className={classes.datePicker}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        minDate={new Date()}
                        error={!row.dateValid}
                        margin="none"
                        id="date-picker-inline"
                        value={row.date}
                        onChange={(date) => this.handleDateChange(date, row.id)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                    <FormHelperText>
                      {row.dateValid ? this.getDateAsWeekString(row.date) : "Please gives dates at least 2 days in advance!"}
                    </FormHelperText>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl error={!row.timeValid}>
                    <Select className={classes.timeSelector} value={row.from} onChange={(event) => this.handleSelectorChange(event, row.id, FIELD_FROM)}>
                      {times}
                    </Select>
                    <FormHelperText>
                      {row.timeValid ? "" : "Start time must be before end time!"}
                    </FormHelperText>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl error={!row.timeValid}>
                    <Select className={classes.timeSelector} value={row.to} onChange={(event) => this.handleSelectorChange(event, row.id, FIELD_TO)}>
                      {times}
                    </Select>
                    <FormHelperText>
                      {row.timeValid ? this.getBlockLengthAsString(row) : "End time must be before start time!"}
                    </FormHelperText>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => { this.handleRemoveRow(row.id) }}>
                    Remove
                              </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>
              </TableCell>
              <TableCell>
                <Fab aria-label="add" size="small" onClick={this.handleAddRow} className={classes.fabAdd}>
                  <AddIcon />
                </Fab>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div>
          <Button color="primary" variant="outlined" onClick={this.handleSubmit} className={classes.submitBtn}>
            Submit
            </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AvailabilityTable);
