import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Icon,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';
import axios from 'axios';

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

const CANDIDATE_TABLE_HEADER = [
  { key: 'lastName', title: 'Last Name' },
  { key: 'firstName', title: 'First Name' },
  { key: 'email', title: 'Email' },
  { key: 'phone', title: 'Phone Number' },
];

const EMPLOYEE_TABLE_HEADER = [
  { key: 'lastName', title: 'Last Name' },
  { key: 'firstName', title: 'First Name' },
  { key: 'email', title: 'Email' },
  { key: 'phone', title: 'Phone Number' },
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

  componentDidMount() {
    const { actions } = this.props;
    actions.getUsers('candidate');
    actions.getUsers('interviewer');
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
    const { classes, candidates, interviewers, actions } = this.props;
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
              rows={interviewers}
              onClickOpenUserDialog={(action, userId) => this.onClickOpenUserDialog(action, userId)}
            />
          </div>
        </Paper>
        <UserDialog
          mode={mode}
          open={openUserDialog}
          onClickCloseDialog={() => this.onClickCloseDialog()}
          selectedUser={selectedUser}
          actions={actions}
        />
      </div>
    );
  }
}

export default withStyles(styles)(DirectoryPage);
