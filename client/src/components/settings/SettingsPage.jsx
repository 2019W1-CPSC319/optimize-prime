import React, { Component } from 'react';
import './settingsPage.css';
import {
  TextField,
  Paper,
  Typography,
  Button
} from '@material-ui/core';

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { subject: '', body: '', signature: '' };
  }

  async componentDidMount() {
    const { actions } = this.props;
    await actions.getEmailTemplate();
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
  }

  render() {
    const { subject, body, signature } = this.state;
    return (
      <div>
        <h1 className="settings-title">Settings</h1>
        <Paper style={{ maxWidth: '700px', margin: '30px', padding: '30px' }}>
          <Typography
            variant='h5'
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
