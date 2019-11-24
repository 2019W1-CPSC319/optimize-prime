import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Icon,
  Paper,
} from '@material-ui/core';

import { CANDIDATE_TABLE_HEADER as headers } from '../../directory/DirectoryPage';

const styles = {};

class CandidateTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, rows, mode } = this.props;
    return (
      <Paper>
        <Table>
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
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>
                    {
                      mode === 'ready' ?
                        <IconButton component={Link} to={`/calendar?id=${row.id}`}>
                          <Icon style={{ color: 'coral' }}>post_add</Icon>
                        </IconButton>
                        :
                        <IconButton onClick={() => this.props.onClickUserAction('mail', row.id)}>
                          <Icon style={{ color: 'coral' }}>mail</Icon>
                        </IconButton>
                    }
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(CandidateTable);
