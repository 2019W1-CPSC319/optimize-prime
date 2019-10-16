import React, { Component } from 'react';

import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"

import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"

import { TableHead, Button } from '@material-ui/core';

import "./AvailabilityTable.css"

class AvailabilityTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: [this.createRow(1, 2, 3)]
    };
  }

  handleAddRow = () => {
    this.setState((prevState, props) => {
      const row = this.createRow(0, 0, 0);
      return {rows: [...prevState.rows, row]};
    })
  }

  createRow(date, from, to) {
      return {date, from, to};
  }

  render() {
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
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.from}</TableCell>
                          <TableCell>{row.to}</TableCell>
                          <TableCell>
                              <Button>
                                  Remove
                              </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
              </Table>
              <Fab aria-label="add" size="small" onClick={this.handleAddRow} className="fab-add">
                  <AddIcon />
              </Fab>
            </div>
        );
  }
}

export default AvailabilityTable;

