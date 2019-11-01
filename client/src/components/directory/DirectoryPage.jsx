import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';

import { connect } from 'react-redux';
import * as candidateSelectors from '../../selectors/CandidateSelectors';
import * as interviewerSelectors from '../../selectors/InterviewerSelectors';

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

class DirectoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      candidates: [],
      interviewers: []
    };
  }

  // get all candidates and interviewers on page load
  componentDidMount() {
    const { fetchInterviewers, fetchCandidates } = this.props.actions;
    fetchInterviewers()
    fetchCandidates()
  }

  render() {
    const { classes } = this.props;
    const { candidates, interviewers } = this.props;


    function handleChange(e, value) {
      this.setState({ value: value });
    }
    
    function Directory(props) {
      const { label, rows } = props
      return <Paper className={classes.directory}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{label} Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.firstName + " " + row.lastName}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell><Button variant="outlined" className={classes.delete}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>;
    }

    return <div>
      <div className={classes.header}>
        <h1 className={classes.title}>Directory</h1>
      </div>
      <Paper style={{ margin: '40px 10px auto' }} square>
        <Tabs
          value={this.state.value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange.bind(this)}
          aria-label="disabled tabs example"
        >
          <Tab label="Candidate" />
          <Tab label="Employee" />
        </Tabs>
        <div hidden={this.state.value !== 0}><Directory label="Candidate" rows={candidates} /></div>
        <div hidden={this.state.value !== 1}><Directory label="Employee" rows={interviewers} /></div>
      </Paper>
    </div>;
  }
}

const mapStateToProps = state => ({
  candidates: candidateSelectors.getCandidates(state),
  interviewers: interviewerSelectors.getInterviewers(state)
})

export default withStyles(styles)(connect(mapStateToProps)(DirectoryPage));
