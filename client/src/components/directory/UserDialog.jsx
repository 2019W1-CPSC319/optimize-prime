import React, { Component } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import logo from '../../images/logo.png';

const styles = {
  dialogTitleRoot: {
    padding: '24px',
  },
  closeButton: {
    position: 'absolute',
    right: '5px',
    top: '5px',
  },
  dialogContentRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '100px',
  },
  textField: {
    width: '400px',
    margin: '10px',
  },
  submitButton: {
    boxShadow: 'none',
    width: '400px',
    height: '50px',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '14px',
    marginTop: '20px',
    marginBottom: '30px',
  },
};

const USER_DIALOG = {
  addTitle: 'Create a User',
  editTitle: 'Edit a User',
  subtitle: 'Please enter user details.',
  fields: [
    { key: 'firstName', title: 'First Name', type: 'string' },
    { key: 'lastName', title: 'Last Name', type: 'string' },
    { key: 'email', title: 'Email', type: 'string' },
    {
      key: 'role',
      title: 'Role',
      type: 'select',
      selectOptions: [
        { key: 'admin', title: 'Administrator' },
        { key: 'candidate', title: 'Candidate' },
      ],
    },
  ],
  actions: {
    addButton: 'Add',
    editButton: 'Save',
  },
};

class UserDialog extends Component {
  constructor(props) {
    super(props);
    const userFields = this.initializeUserInfoFields();
    this.state = {
      ...userFields,
    };
  }

  initializeUserInfoFields = () => {
    const state = {};
    USER_DIALOG.fields.forEach((field) => {
      state[field.key] = '';
    });
    return state;
  }

  onClickSubmit = () => {
    const { actions, mode, onClickCloseDialog } = this.props;
    const {
      firstName,
      lastName,
      email,
      role,
    } = this.state;

    if (mode === 'add') {
      // TODO: add user action
      // actions.signUpUser({
      //   firstName,
      //   lastName,
      //   email,
      //   role,
      // });
    } else if (mode === 'edit') {
      // TODO: edit user action
      // actions.updateUser({
      //   firstName,
      //   lastName,
      //   email,
      //   role,
      // });
    }

    onClickCloseDialog();
  }

  onChangeTextField = (fieldKey, event) => {
    this.setState({ [fieldKey]: event.target.value });
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.isDisabled()) return;
      this.onClickSubmit();
    }
  }

  getDialogInfoForMode = () => {
    const { mode } = this.props;

    const { addTitle, editTitle, actions, ...dialogProps } = USER_DIALOG;

    const title = USER_DIALOG[`${mode}Title`] || '';
    const button = actions[`${mode}Button`] || '';

    return { title, button, ...dialogProps };
  }

  renderInputComponent = (infoField) => {
    const { classes } = this.props;
    const { key, title, type, selectOptions } = infoField;
    const isSelect = type === 'select';

    return (
      <TextField
        select={isSelect}
        value={this.state[key]}
        key={key}
        variant="outlined"
        className={classes.textField}
        label={title}
        onChange={e => this.onChangeTextField(key, e)}
        onKeyPress={e => this.onKeyPress(e)}
      >
        {
          isSelect
            ? (
              selectOptions.map(option => (
                <MenuItem key={option.key} value={option.key}>
                  {option.title}
                </MenuItem>
              ))
            )
            : null
        }
      </TextField>
    );
  }

  isDisabled = () => {
    const {
      firstName,
      lastName,
      email,
      role,
    } = this.state;

    return !firstName || !lastName || !email || !role;
  }

  render() {
    const { classes, open, onClickCloseDialog } = this.props;
    const dialog = this.getDialogInfoForMode();
    const {
      title,
      subtitle,
      fields,
      button,
    } = dialog;

    return (
      <Dialog
        open={open}
        onClose={onClickCloseDialog}
      >
        <DialogTitle disableTypography classes={{ root: classes.dialogTitleRoot }}>
          {title}
          <IconButton className={classes.closeButton} onClick={onClickCloseDialog}>
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContentRoot }}>
          <img src={logo} alt="logo" className={classes.logo} />
          <DialogContentText>
            {subtitle}
          </DialogContentText>
          {
            fields.map(infoField => (
              this.renderInputComponent(infoField)
            ))
          }
          <Button
            color="primary"
            variant="contained"
            className={classes.submitButton}
            onClick={() => this.onClickSubmit()}
            disabled={this.isDisabled()}
          >
            {button}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(UserDialog);
