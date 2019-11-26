import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from '@material-ui/core';

const styles = {
  table: {
    minWidth: 650,
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    color: '#f0a017',
  },
  scheduledMessage: {
    fontSize: 'small',
  },
  scheduledIcon: {
    color: 'red',
  },
  emptyRow: {
    textAlign: 'center',
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
    const {
      classes,
      headers,
      rows,
      allowedActions,
      user,
      onClickUserAction,
      scheduledCandidateIds,
    } = this.props;
    const { username } = user;

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
            rows.length > 0
              ? (
                rows.map((row, key) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">
                      {row.lastName}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.firstName}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    {
                      row.phone
                        ? <TableCell>{row.phone}</TableCell>
                        : null
                    }
                    <TableCell>
                      <div className={classes.actionsContainer}>
                        {
                          allowedActions.map(action => {
                            const { key, icon } = action;

                            if (key === 'scheduled') {

                              if (!scheduledCandidateIds || !scheduledCandidateIds.includes(row.id)) return null;

                              return (
                                <Tooltip
                                  title={
                                    <Typography className={classes.scheduledMessage}>
                                      This candidate has been scheduled for interview(s). You can request for their availability again if you wish to schedule another interview for this candidate.
                                    </Typography>
                                  }
                                >
                                  <Icon className={classes.scheduledIcon}>{icon}</Icon>
                                </Tooltip>
                              );
                            }

                            return (
                              <IconButton
                                className={classes.iconButton}
                                key={key}
                                onClick={() => onClickUserAction(key, row.id)}
                                disabled={username === row.email}
                              >
                                <Icon>{icon}</Icon>
                              </IconButton>
                            );
                          })
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )
              : (
                <TableRow>
                  <TableCell
                    className={classes.emptyRow}
                    colSpan={headers.length + 1}
                  >
                    No entries available
                  </TableCell>
                </TableRow>
              )
          }
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(DirectoryTable);
