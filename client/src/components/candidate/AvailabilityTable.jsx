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

  <MenuItem value={14}>4:00pm</MenuItem>,
  <MenuItem value={14.25}>4:15pm</MenuItem>,
  <MenuItem value={14.5}>4:30pm</MenuItem>,
  <MenuItem value={14.75}>4:45pm</MenuItem>,

  <MenuItem value={14}>5:00pm</MenuItem>,
  <MenuItem value={14.25}>5:15pm</MenuItem>,
  <MenuItem value={14.5}>5:30pm</MenuItem>,
  <MenuItem value={14.75}>5:45pm</MenuItem>,
]

const styles = {
  fabAdd: {
    borderRadius: "4px",
    top: "-1em",
    left: "40%",
    backgroundColor: "#4CAF50",
    margin: "30px 30px"
  }
}

class AvailabilityTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      indexctr: 1,
      rows: [this.createRow(0, new Date(), 2, 3)]
    };
  }

  handleAddRow = () => {
    // Adds a row to the table
    this.setState((prevState, props) => {
      const row = this.createRow(this.state.indexctr, new Date(), 0, 0);
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

  handleSelectorChange = event => {
    event.target.name = "1pm";
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
                                   margin="0"
                                   id="date-picker-inline"
                                  //  label="Select your availability"
                                   value={row.date}
                                   // onChange={handleDateChange}
                                   KeyboardButtonProps={{
                                       'aria-label': 'change date',
                                   }}
                               />
                           {/* </Grid> */}
                       </MuiPickersUtilsProvider>
                          </TableCell>
                          <TableCell>
                            {/* <Select className="selector" onChange={this.handleSelectorChange}inputProps={{id: 'start', name: "Start"}}> */}
                            <Select className="selector" onChange={this.handleSelectorChange()}>
                              {times}
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select className="selector" onChange={this.handleSelectorChange()}>
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
                        <Button color="primary" variant="outlined" >
                          Submit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Fab aria-label="add" size="small" onClick={this.handleAddRow} className={classes.fabAdd}>
                          <AddIcon />
                        </Fab>
                      </TableCell>
                    </TableRow>
                  </TableBody>
              </Table>
            </div>
        );
  }
}

export default withStyles(styles)(AvailabilityTable);