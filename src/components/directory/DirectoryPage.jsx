import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Tab,
  Tabs,
  Paper
} from '@material-ui/core';

import DirectoryTable from './subComponents/DirectoryTable';

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

function createData(lastName, firstName, email, job, password) {
  return { lastName, firstName, email, job, password };
}

const candidates = [
  createData('Evans', 'Chris', 'University of British Columbia', 'c.evans@gmail.com', '********'),
  createData('Downey Jr.', 'Robert', 'Simon Fraser University', 'r.downey@gmail.com', '********'),
  createData('Johansen', 'Scarlet', 'British Columbia Institue of Technology', 's.johansen@gmail.com', '********'),
  createData('Holland', 'Tom', 'University of Waterloo', 't.holland@gmail.com', '********'),
  createData('Cumberbatch', 'Benedict', 'University of Victoria', 'b.cumberbatch@gmail.com', '********'),
];

const employees = [
  createData('America', 'Captain', 'Senior Project Manager', 'c.america@galvanize.com', '********'),
  createData('Man', 'Iron', 'UX Designer', 'i.man@galvanize.com', '********'),
  createData('Widow', 'Black', 'Junior Software Developer', 'b.widow@galvanize.com', '********'),
  createData('Man', 'Spider', 'Business Analyst', 's.man@galvanize.com', '********'),
  createData('Strange', 'Dr.', 'Senior Project Owner', 'd.strange@galvanize.com', '********'),
];

class DirectoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  handleChange = (e, tab) => {
    this.setState({ value: tab });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.header}>
          <h1 className={classes.title}>Directory</h1>
        </div>
        <Paper style={{ margin: '40px 10px auto' }} square>
          <Tabs
            value={this.state.value}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, tab) => this.handleChange(e, tab)}
            aria-label="disabled tabs example"
          >
            <Tab label="Candidate" />
            <Tab label="Employee" />
          </Tabs>
          <div hidden={this.state.value !== 0}><DirectoryTable label="Candidate" rows={candidates} /></div>
          <div hidden={this.state.value !== 1}><DirectoryTable label="Employee" rows={employees} /></div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(DirectoryPage);
