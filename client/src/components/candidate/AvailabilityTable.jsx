import React, { Component } from 'react';

import { withStyles } from "@material-ui/core/styles"
// Material UI
import {
        Table, TableBody, TableHead, TableCell, TableRow,
        Select, MenuItem, Button
       } from "@material-ui/core"
import {
        MuiPickersUtilsProvider,
        KeyboardDatePicker,
       } from '@material-ui/pickers';
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"

// Date Picker
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';

import "./AvailabilityTable.css"

const FIELD_FROM = 1;
const FIELD_TO = 2;

const times = [
  <MenuItem value={9}>9:00am</MenuItem>,
  <MenuItem value={9.25}>9:15am</MenuItem>,
  <MenuItem value={9.5}>9:30am</MenuItem>,
  <MenuItem value={9.75}>9:45am</MenuItem>,

  <MenuItem value={10}>10:00am</MenuItem>,
  <MenuItem value={10.25}>10:15am</MenuItem>,
  <MenuItem value={10.5}>10:30am</MenuItem>,
  <MenuItem value={10.75}>10:45am</MenuItem>,

  <MenuItem value={11}>11:00am</MenuItem>,
  <MenuItem value={11.25}>11:15am</MenuItem>,
  <MenuItem value={11.5}>11:30am</MenuItem>,
  <MenuItem value={11.75}>11:45am</MenuItem>,

  <MenuItem value={12}>12:00pm</MenuItem>,
  <MenuItem value={12.25}>12:15pm</MenuItem>,
  <MenuItem value={12.5}>12:30pm</MenuItem>,
  <MenuItem value={12.75}>12:45pm</MenuItem>,

  <MenuItem value={13}>1:00pm</MenuItem>,
  <MenuItem value={13.25}>1:15pm</MenuItem>,
  <MenuItem value={13.5}>1:30pm</MenuItem>,
  <MenuItem value={13.75}>1:45pm</MenuItem>,

  <MenuItem value={14}>2:00pm</MenuItem>,
  <MenuItem value={14.25}>2:15pm</MenuItem>,
  <MenuItem value={14.5}>2:30pm</MenuItem>,
  <MenuItem value={14.75}>2:45pm</MenuItem>,

  <MenuItem value={15}>3:00pm</MenuItem>,
  <MenuItem value={15.25}>3:15pm</MenuItem>,
  <MenuItem value={15.5}>3:30pm</MenuItem>,
  <MenuItem value={15.75}>3:45pm</MenuItem>,

  <MenuItem value={16}>4:00pm</MenuItem>,
  <MenuItem value={16.25}>4:15pm</MenuItem>,
  <MenuItem value={16.5}>4:30pm</MenuItem>,
  <MenuItem value={16.75}>4:45pm</MenuItem>,

  <MenuItem value={17}>5:00pm</MenuItem>,
  <MenuItem value={17.25}>5:15pm</MenuItem>,
  <MenuItem value={17.5}>5:30pm</MenuItem>,
  <MenuItem value={17.75}>5:45pm</MenuItem>
]

const styles = {
  fabAdd: {
    borderRadius: "4px",
    backgroundColor: "#4CAF50",
  },
  submitBtn: {
    borderRadius: "4px",
    margin: "30px 30px",
  }
}

class AvailabilityTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      indexctr: 1,
      rows: [this.createRow(0, new Date(), 9, 17)],
      submitHandler: props.submitHandler
    };
  }

  handleAddRow = () => {
    // Adds a row to the table
    this.setState((prevState, props) => {
      const row = this.createRow(this.state.indexctr, new Date(), 9, 17);
      const newindex = this.state.indexctr + 1
      this.setState({indexctr: newindex, rows: [...prevState.rows, row]})
    })
  }

  handleRemoveRow = (id) => {
    // Removes the row with the specified id in the table
    const rows = this.state.rows;
    for (const row of rows) {
      if (row.id == id) {
        rows.splice(rows.indexOf(row), 1);
      }
    }
    this.setState({rows: rows});
    return {rows: rows};
  }

  createRow(id, date, from, to) {
    return {id, date, from, to};
  }

  /**
   * Handler for selecting different times in the to or from fields.
   */
  handleSelectorChange = (event) = (event, id, field) => {
    const rows = this.state.rows;
    for (const row of rows){
      if (row.id == id) {
        if (field == FIELD_FROM) {
          row.from = event.target.value;
        } else {
          row.to = event.target.value;
        }
      }
    }
    this.setState(rows);
  }

  /**
   * Hadler for submit button
   */
  handleDateChange = (event) = (date, id) => {
    const rows = this.state.rows;
    rows[id].date = date;
    this.setState({rows: rows});
  }

  handleSubmit = () => {
    var times = [];
    for (const row of this.state.rows) {
      const start = new Date(row.date.getYear(),
                             row.date.getMonth(),
                             row.date.getDay(),
                             row.from,
                             (row.from % 1) * 60)
      const end = new Date(row.date.getYear(),
                           row.date.getMonth(),
                           row.date.getDay(),
                           row.to,
                           (row.to% 1) * 60)
      times.push({start: start, end: end});
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
                        <TableRow>
                          <TableCell>
                          <MuiPickersUtilsProvider utils={DateFnsUtils} className="date-picker">
                           {/* <Grid container > */}
                               <KeyboardDatePicker
                                   disableToolbar
                                   variant="inline"
                                   format="MM/dd/yyyy"
                                   minDate={new Date()}
                                   margin="none"
                                   id="date-picker-inline"
                                  //  label="Select your availability"
                                   value={row.date}
                                   onChange={(date) => this.handleDateChange(date, row.id)}
                                   KeyboardButtonProps={{
                                       'aria-label': 'change date',
                                   }}
                               />
                           {/* </Grid> */}
                       </MuiPickersUtilsProvider>
                          </TableCell>
                          <TableCell>
                            {/* <Select className="selector" onChange={this.handleSelectorChange}inputProps={{id: 'start', name: "Start"}}> */}
                            <Select className="selector" value={row.from} onChange={(event) => this.handleSelectorChange(event, row.id, FIELD_FROM)}>
                              {times}
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select className="selector" value={row.to} onChange={(event) => this.handleSelectorChange(event, row.id, FIELD_TO)}>
                              {times}
                            </Select>
                          </TableCell>
                          <TableCell>
                              <Button variant="outlined" color="primary" onClick={() => {this.handleRemoveRow(row.id)}}>
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