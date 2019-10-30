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
import axios from 'axios';

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
    axios.get('/schedule/candidates').then(res => {
      this.setState({
        candidates: res.data
      });
    }).catch(error => {
      console.log(error);
    });
    axios.get('/schedule/interviewers').then(res => {
      this.setState({
        interviewers: res.data
      });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const { classes } = this.props;
    const {candidates, interviewers} = this.state;
    

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
              <TableRow key={row.CandidateID}>
                <TableCell component="th" scope="row">
                  {row.FirstName + " " + row.LastName}
                </TableCell>
                <TableCell>{row.Email}</TableCell>
                <TableCell>{row.Phone}</TableCell>
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

export default withStyles(styles)(DirectoryPage);
