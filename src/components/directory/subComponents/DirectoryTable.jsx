import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';

const styles = theme => ({
  title: {
    fontWeight: 'normal',
    marginLeft: '30px',
  },
  flex: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  header: {
    justifyContent: 'space-between',
  },
  directory: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  delete: {
    color: '#ff454e',
    borderColor: '#ff454e',
    '&:hover': {
      backgroundColor:
        'rgba(255, 69, 78, 0.2)'
    }
  }
});

const CANDIDATE_TABLE_HEADER = [
  { id: 'lastName', title: 'Last Name' },
  { id: 'firstName', title: 'First Name' },
  { id: 'email', title: 'Email' },
  { id: 'school', title: 'School Name' },
];

const EMPLOYEE_TABLE_HEADER = [
  { id: 'lastName', title: 'Last Name' },
  { id: 'firstName', title: 'First Name' },
  { id: 'email', title: 'Email' },
  { id: 'title', title: 'Job Title' },
];

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
    const { classes, label, rows } = this.props;
    const tableHeader = label === 'Candidate' ? CANDIDATE_TABLE_HEADER : EMPLOYEE_TABLE_HEADER;

    return (
      <Paper className={classes.directory}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {
                tableHeader.map(header => (
                  <TableCell>{header.title}</TableCell>
                ))
              }
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.lastName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.firstName}
                </TableCell>
                <TableCell>{row.job}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell><Button variant="outlined" className={classes.delete}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(DirectoryTable);
