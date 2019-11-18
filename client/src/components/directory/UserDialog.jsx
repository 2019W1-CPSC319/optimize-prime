import React, { Component } from 'react';
import InputMask from "react-input-mask";
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
import Swal from 'sweetalert2';

import logo from '../../images/logo.png';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true,
});

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
    { key: 'firstName', title: 'First Name', type: 'string', helperText: 'First letter should be capitalized. No whitespaces allowed.' },
    { key: 'lastName', title: 'Last Name', type: 'string', helperText: 'First letter should be capitalized. No whitespaces allowed.' },
    { key: 'email', title: 'Email', type: 'string', helperText: 'Invalid email address format.' },
    { key: 'phone', title: 'Phone Number', type: 'string', helperText: 'e.g. 999-999-9999.' },
    {
      key: 'role',
      title: 'Role',
      type: 'select',
      helperText: '',
      selectOptions: [
        { key: 'admin', title: 'Administrator' },
        { key: 'interviewer', title: 'Interviewer' },
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
      ...userFields
    };
  }

  initializeUserInfoFields = () => {
    const state = {};
    USER_DIALOG.fields.forEach((field) => {
      state[field.key] = '';
    });
    return {
      ...state,
      error: {
        firstName: false,
        lastName: false,
        email: false,
        phone: false,
        role: false
      }
    };
  }

  onClickSubmit = async () => {
    const { actions, mode, onClickCloseDialog } = this.props;
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      error
    } = this.state;

    if (Object.values(error).filter(value => value).length === 0) {
      if (mode === 'add') {
        await actions.addUser(role, {
          firstName,
          lastName,
          email,
          phone: phone.replace(/[\D]/g, ''),
          role,
        });
        if (role.toLowerCase() === 'candidate') {
          swalWithBootstrapButtons.fire({
            title: 'A new user profile has been created!',
            text: "Do you want to send an email to collect candidate\'s availability?",
            type: 'success',
            showCancelButton: true,
            confirmButtonText: 'Send Email',
            cancelButtonText: 'Cancel',
            reverseButtons: true
          }).then(async (result) => {
            const { value } = result;
            if (value) {
              await actions.sendEmail({
                firstName,
                lastName,
                email,
                phone: phone.replace(/[\D]/g, ''),
                role,
              });
              swalWithBootstrapButtons.fire(
                'Email is sent!',
                'You\'re all set.',
                'success'
              );
            }
          });
        } else {
          swalWithBootstrapButtons.fire(
            'A new user profile has been created!',
            'You\'re all set.',
            'success'
          );
        }
      } else if (mode === 'edit') {
        // TODO: edit user action
        // actions.updateUser({
        //   firstName,
        //   lastName,
        //   email,
        //   role,
        // });
      }

      // swalWithBootstrapButtons.fire(
      //   mode === 'add' ? 'Added!' : 'Saved',
      //   `That user has been ${mode === 'add' ? 'added' : 'saved'}`,
      //   'success'
      // )
      // Clear dialog state
      this.setState(this.initializeUserInfoFields());
      onClickCloseDialog();
    }
  }

  onChangeTextField = (fieldKey, event) => {
    this.setState({ [fieldKey]: event.target.value });
  }

  onBlurTextField = (fieldKey, event) => {
    this.setState({ error: { ...this.state.error, [fieldKey]: this.onValidate(fieldKey, event.target.value) } });
  }

  onValidate = (fieldKey, value) => {
    switch (fieldKey) {
      case 'firstName':
        return !/^[A-Z][a-zA-Z'][^#&<>\"~;$^%{}?]{1,20}$/g.test(value);
      case 'lastName':
        return !/^[A-Z][a-zA-Z'][^#&<>\"~;$^%{}?]{1,20}$/g.test(value);
      case 'email':
        return !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/g.test(value);
      case 'phone':
        return !/^\d{3}\s-\s\d{3}\s-\s\d{4}$/g.test(value);
      default:
        return false;
    }
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
    const { error } = this.state;
    const { key, title, type, helperText, selectOptions } = infoField;
    const isSelect = type === 'select';

    return (
      <TextField
        autoFocus={key === 'firstName'}
        error={error[key]}
        select={isSelect}
        value={this.state[key]}
        key={key}
        variant="outlined"
        className={classes.textField}
        label={title}
        onChange={e => this.onChangeTextField(key, e)}
        onKeyPress={e => this.onKeyPress(e)}
        onBlur={e => this.onBlurTextField(key, e)}
        helperText={error[key] ? helperText : ''}
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
      phone,
      role,
    } = this.state;

    return !firstName || !lastName || !email || !phone || !role;
  }

  onEnter = () => {
    const { selectedUser } = this.props;
    if (selectedUser) {
      this.setState({ ...selectedUser })
    }
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
        onEnter={this.onEnter}
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
            fields.map(infoField => {
              const { error } = this.state;
              const { key, helperText } = infoField;
              if (key === 'phone')
                return (
                  <InputMask
                    key={key}
                    mask="999 - 999 - 9999"
                    label={title}
                    onBlur={e => this.onBlurTextField(key, e)}
                    onChange={e => this.onChangeTextField(key, e)}
                    value={this.state[key]}
                    alwaysShowMask>
                    <TextField
                      autoFocus={key === 'firstName'}
                      error={error[key]}
                      key={key}
                      variant="outlined"
                      className={classes.textField}
                      label={title}
                      onKeyPress={e => this.onKeyPress(e)}
                      helperText={error[key] ? helperText : ''}
                    ></TextField>
                  </InputMask>
                );
              else return (this.renderInputComponent(infoField));
            })
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
