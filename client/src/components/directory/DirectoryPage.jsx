import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Icon,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';

import { connect } from 'react-redux';
import * as candidateSelectors from '../../selectors/CandidateSelectors';
import * as interviewerSelectors from '../../selectors/InterviewerSelectors';
import Swal from 'sweetalert2';
import DirectoryTable from './subComponents/DirectoryTable';
import UserDialog from './UserDialog';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true,
});

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

const tabs = [
  { key: 'candidate', title: 'Candidates' },
  { key: 'interviewer', title: 'Interviewers' },
]

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

  async componentDidMount() {
    // const { fetchInterviewers, fetchCandidates } = this.props.actions;
    const { actions } = this.props;
    await actions.fetchInterviewers();
    await actions.getUsers();
  }

  onClickUserAction = (mode, userId) => {
    if (!ALLOWED_USER_ACTIONS.includes(mode)) return;

    if (mode === 'delete') {
      const { actions } = this.props;
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then(async (result) => {
        const { value } = result;
        if (value) {
          const { value: tabIndex } = this.state;
          await actions.deleteUser(tabs[tabIndex].key, userId);
          swalWithBootstrapButtons.fire(
            'Deleted',
            'The user has been deleted.',
            'success'
          );
        }
      });
    } else {
      this.setState({
        mode,
        selectedUser: userId || '',
        openUserDialog: true,
      });
    }
  }

  onClickCloseDialog = () => {
    this.setState({
      mode: '',
      openUserDialog: false
    });
  }

  onChangeTab = (e, index) => {
    this.setState({ value: index });
  }

  renderDirectoryTable = () => {
    const { candidates, interviewers } = this.props;
    const { value } = this.state;
    const key = tabs[value].key;

    if (key === 'candidate') {
      return (
        <DirectoryTable
          headers={CANDIDATE_TABLE_HEADER}
          rows={candidates}
          onClickUserAction={(action, userId) => this.onClickUserAction(action, userId)}
        />
      );
    } else if (key === 'interviewer') {
      return (
        <DirectoryTable
          headers={EMPLOYEE_TABLE_HEADER}
          rows={interviewers}
          onClickUserAction={(action, userId) => this.onClickUserAction(action, userId)}
        />
      );
    }

    return null;
  }


  /*
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
  This came up in the merge but does not seem to be used*/

  render() {
    const { classes, actions } = this.props;
    const { value, mode, openUserDialog, selectedUser } = this.state;

    return (
      <div>
        <div className={classes.header}>
          <h1 className={classes.title}>Directory</h1>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => this.onClickUserAction('add')}
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
            onChange={(e, tabIndex) => this.onChangeTab(e, tabIndex)}
          >
            {
              tabs.map(tab => (
                <Tab key={tab.key} label={tab.title} />
              ))
            }
          </Tabs>
          {this.renderDirectoryTable()}
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

const mapStateToProps = state => ({
  candidates: candidateSelectors.getCandidates(state),
  interviewers: interviewerSelectors.getInterviewers(state)
})

export default withStyles(styles)(connect(mapStateToProps)(DirectoryPage));
