import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Icon,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';

import DirectoryTable from './subComponents/DirectoryTable';
import UserDialog from './UserDialog';

const styles = {
  title: {
    fontWeight: 'normal',
    marginLeft: '30px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  tableContainer: {
    margin: '40px 10px',
  },
};

function createData(id, lastName, firstName, email, job, password) {
  return { id, lastName, firstName, email, job, password };
}

const candidates = [
  createData(1, 'Evans', 'Chris', 'University of British Columbia', 'c.evans@gmail.com', '********'),
  createData(2, 'Downey Jr.', 'Robert', 'Simon Fraser University', 'r.downey@gmail.com', '********'),
  createData(3, 'Johansen', 'Scarlet', 'British Columbia Institue of Technology', 's.johansen@gmail.com', '********'),
  createData(4, 'Holland', 'Tom', 'University of Waterloo', 't.holland@gmail.com', '********'),
  createData(5, 'Cumberbatch', 'Benedict', 'University of Victoria', 'b.cumberbatch@gmail.com', '********'),
];

const employees = [
  createData(6, 'America', 'Captain', 'Senior Project Manager', 'c.america@galvanize.com', '********'),
  createData(7, 'Man', 'Iron', 'UX Designer', 'i.man@galvanize.com', '********'),
  createData(8, 'Widow', 'Black', 'Junior Software Developer', 'b.widow@galvanize.com', '********'),
  createData(9, 'Man', 'Spider', 'Business Analyst', 's.man@galvanize.com', '********'),
  createData(10, 'Strange', 'Dr.', 'Senior Project Owner', 'd.strange@galvanize.com', '********'),
];

const CANDIDATE_TABLE_HEADER = [
  { key: 'lastName', title: 'Last Name' },
  { key: 'firstName', title: 'First Name' },
  { key: 'email', title: 'Email' },
  { key: 'school', title: 'School Name' },
];

const EMPLOYEE_TABLE_HEADER = [
  { key: 'lastName', title: 'Last Name' },
  { key: 'firstName', title: 'First Name' },
  { key: 'email', title: 'Email' },
  { key: 'title', title: 'Job Title' },
];

const ALLOWED_USER_ACTIONS = [
  'add',
  'edit',
  'delete',
];

class DirectoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      mode: '',
      openUserDialog: false,
      selectedUser: '',
    };
  }

  onClickOpenUserDialog = (mode, userId) => {
    if (!ALLOWED_USER_ACTIONS.includes(mode)) return;
    this.setState({
      mode,
      selectedUser: userId || '',
      openUserDialog: true,
    });
  }

  onClickCloseDialog = () => {
    this.setState({
      mode: '',
      openUserDialog: false
    });
  }

  onChangeTab = (e, tab) => {
    this.setState({ value: tab });
  }

  render() {
    const { classes } = this.props;
    const { value, mode, openUserDialog, selectedUser } = this.state;

    return (
      <div>
        <div className={classes.header}>
          <h1 className={classes.title}>Directory</h1>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => this.onClickOpenUserDialog('add')}
          >
            <Icon className={classes.icon}>person_add</Icon>
            ADD NEW USER
          </Button>
        </div>
        <Paper className={classes.tableContainer}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, tab) => this.onChangeTab(e, tab)}
          >
            <Tab label="Candidate" />
            <Tab label="Employee" />
          </Tabs>
          <div hidden={value !== 0}>
            <DirectoryTable
              headers={CANDIDATE_TABLE_HEADER}
              rows={candidates}
              onClickOpenUserDialog={(action, userId) => this.onClickOpenUserDialog(action, userId)}
            />
          </div>
          <div hidden={value !== 1}>
            <DirectoryTable
              headers={EMPLOYEE_TABLE_HEADER}
              rows={employees}
              onClickOpenUserDialog={(action, userId) => this.onClickOpenUserDialog(action, userId)}
            />
          </div>
        </Paper>
        <UserDialog
          mode={mode}
          open={openUserDialog}
          onClickCloseDialog={() => this.onClickCloseDialog()}
          selectedUser={selectedUser}
        />
      </div>
    );
  }
}

export default withStyles(styles)(DirectoryPage);
