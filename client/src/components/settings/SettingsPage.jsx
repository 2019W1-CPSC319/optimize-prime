import React, { Component } from 'react';
import './settingsPage.css';
import {
  TextField,
  Paper,
  Typography,
  Button
} from '@material-ui/core';
import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true,
});

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { subject: '', body: '', signature: '' };
  }

  async componentDidMount() {
    const { actions } = this.props;
    try {
      await actions.getEmailTemplate();
    } catch (error) {
      console.log(error);
    }
    const { template: { subject, body, signature } } = this.props;
    this.setState({ subject, body, signature });
  }

  onChangeTextField = (fieldKey, event) => {
    this.setState({ [fieldKey]: event.target.value });
  }

  onSubmit = async () => {
    const { actions } = this.props;
    const { subject, body, signature } = this.state;
    await actions.updateEmailTemplate(subject, body, signature);
    swalWithBootstrapButtons.fire(
      'Change has been saved!',
      'You\'re all set.',
      'success'
    );
  }

  render() {
    const { subject, body, signature } = this.state;
    return (
      <div>
        <h1 className="settings-title">Settings</h1>
        <Paper style={{ margin: '30px', padding: '30px' }}>
          <Typography
            variant='h6'
          >Email Template</Typography>
          <TextField
            label="Subject"
            onChange={(event) => this.onChangeTextField('subject', event)}
            margin="normal"
            value={subject}
            variant="outlined"
            style={{ width: '500px', display: 'block' }}
            inputProps={{
              style: { width: '500px', display: 'block' }
            }}
          />
          <TextField
            label="Body"
            multiline
            onChange={(event) => this.onChangeTextField('body', event)}
            margin="normal"
            value={body}
            variant="outlined"
            style={{ width: '500px', display: 'block' }}
            inputProps={{
              style: { width: '500px', display: 'block' }
            }}
          />
          <TextField
            label="Signature"
            multiline
            onChange={(event) => this.onChangeTextField('signature', event)}
            margin="normal"
            value={signature}
            variant="outlined"
            style={{ width: '500px', display: 'block' }}
            inputProps={{
              style: { width: '500px', display: 'block' }
            }}
          />
          <Button
            variant='outlined'
            style={{
              padding: '10px 30px',
              marginTop: '10px'
            }}
            onClick={this.onSubmit}
          >
            Save
          </Button>
        </Paper>
      </div >
    )
  }
}

export default SettingsPage;
