import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

const styles = {
  table: {
    minWidth: 650,
  },
};

class DirectoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  handleChange = (e, value) => {
    this.setState({ value: value });
  }

  render() {
    const { classes, headers, rows, allowedActions, onClickUserAction } = this.props;

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {
              headers.map(header => (
                <TableCell key={header.key}>{header.title}</TableCell>
              ))
            }
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows.map((row, key) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {row.lastName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.firstName}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone ? row.phone : ''}</TableCell>
                <TableCell>
                  {
                    allowedActions.map(action => {
                      const { key, icon } = action;
                      return (
                        <IconButton
                          key={key}
                          onClick={() => onClickUserAction(key, row.id)}
                        >
                          <Icon>{icon}</Icon>
                        </IconButton>
                      );
                    })
                  }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(DirectoryTable);
