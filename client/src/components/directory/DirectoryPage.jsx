import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Fab,
  Icon,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';
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
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 30px',
  },
  tableContainer: {
    margin: '0 30px',
  },
  addButton: {
    position: 'fixed',
    right: '30px',
    bottom: '30px',
    backgroundColor: '#003b9a',
  },
};

const CANDIDATE_TABLE_HEADER = [
  { key: 'lastName', title: 'Last Name' },
  { key: 'firstName', title: 'First Name' },
  { key: 'email', title: 'Email' },
  { key: 'phone', title: 'Phone Number' },
];

const INTERVIEWER_TABLE_HEADER = [
  { key: 'lastName', title: 'Last Name' },
  { key: 'firstName', title: 'First Name' },
  { key: 'email', title: 'Email' },
];

const ADMINISTRATOR_TABLE_HEADER = [
  { key: 'lastName', title: 'Last Name' },
  { key: 'firstName', title: 'First Name' },
  { key: 'email', title: 'Email' },
  { key: 'phone', title: 'Phone Number' },
];

const tabs = [
  {
    key: 'candidate',
    title: 'Candidates',
    allowedActions: [
      { key: 'mail', icon: 'mail' },
      { key: 'edit', icon: 'edit' },
      { key: 'delete', icon: 'delete' },
    ],
  },
  {
    key: 'interviewer',
    title: 'Interviewers',
    allowedActions: [],
  },
  {
    key: 'administrator',
    title: 'Administrators',
    allowedActions: [
      { key: 'edit', icon: 'edit' },
      { key: 'delete', icon: 'delete' },
    ],
  },
]

class DirectoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      mode: '',
      openUserDialog: false,
      selectedUserId: '',
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getUsers('candidate');
    actions.getUsers('administrator');
    actions.getOutlookUsers();
  }

  onClickUserAction = (mode, userId) => {
    const { value: tabIndex } = this.state;

    // Add is by default available regardless of tab
    if (mode === 'add') {
      this.setState({
        mode,
        selectedUserId: '',
        openUserDialog: true,
      });
    }

    if (!tabs[tabIndex].allowedActions.find(action => action.key === mode)) return;
    const { actions } = this.props;

    if (mode === 'delete') {
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
          const response = await actions.deleteUser(tabs[tabIndex].key, userId);
          if (response && !response.error) {
            swalWithBootstrapButtons.fire(
              'Deleted',
              'The user has been deleted.',
              'success'
            );
          }
        }
      });
    } else if (mode === 'mail') {
      const { candidates } = this.props;
      const candidate = candidates.find(c => c.id === userId);
      if (!candidate) return;
      const {
        firstName,
        lastName,
        email,
        phone,
        role,
      } = candidate;
      swalWithBootstrapButtons.fire({
        text: "Do you want to send an email to collect candidate\'s availability?",
        type: 'success',
        showCancelButton: true,
        confirmButtonText: 'Send Email',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then(async (result) => {
        const { value } = result;
        if (value) {
          const response = await actions.sendEmail({
            firstName,
            lastName,
            email,
            phone,
            role,
          });
          if (response && !response.error) {
            swalWithBootstrapButtons.fire(
              'Email is sent!',
              'You\'re all set.',
              'success'
            );
          }
        }
      });
    } else {
      // Edit user
      this.setState({
        mode,
        selectedUserId: userId,
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

  getSelectedUser = () => {
    const { value, selectedUserId } = this.state;
    const selectedUserType = tabs[value].key;
    const selectedUser = this.props[`${selectedUserType}s`].find(user => user.id === selectedUserId) || {};
    const formattedUser = {
      ...selectedUser,
      role: selectedUserType,
    };
    return formattedUser;
  }

  renderDirectoryTable = () => {
    const { user } = this.props;
    const { value } = this.state;
    const key = tabs[value].key;
    let headers;

    switch (key) {
      case 'candidate':
        headers = CANDIDATE_TABLE_HEADER;
        break;
      case 'interviewer':
        headers = INTERVIEWER_TABLE_HEADER;
        break;
      case 'administrator':
        headers = ADMINISTRATOR_TABLE_HEADER;
        break;
      default:
        return null;
    }

    return (
      <DirectoryTable
        headers={headers}
        rows={this.props[`${key}s`]}
        allowedActions={tabs[value].allowedActions}
        onClickUserAction={(action, userId) => this.onClickUserAction(action, userId)}
        type={key}
        user={user}
      />
    );
  }

  render() {
    const { classes, actions } = this.props;
    const { value, mode, openUserDialog } = this.state;

    return (
      <div>
        <div className={classes.header}>
          <h1 className={classes.title}>Directory</h1>
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
        <Fab
          color="primary"
          className={classes.addButton}
          onClick={() => this.onClickUserAction('add')}
        >
          <Icon>add_rounded</Icon>
        </Fab>
        {
          // This condition is necessary to make sure UserDialog is
          // only rendered when we actually set openUserDialog to true.
          // Otherwise, edit mode wouldn't work because when Directory
          // Page first renders, it does not have a selected user.
          openUserDialog
            && (
              <UserDialog
                mode={mode}
                open={openUserDialog}
                onClickCloseDialog={() => this.onClickCloseDialog()}
                selectedUser={mode === 'edit' ? this.getSelectedUser() : {}}
                actions={actions}
              />
            )
        }
      </div>
    );
  }
}

export default withStyles(styles)(DirectoryPage);
