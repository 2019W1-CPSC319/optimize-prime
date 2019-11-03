import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './settingsPage.css';
import logo from '../../images/galvanize.png';
import axios from 'axios';


class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  findMeetingTimes() {
    // const url = "https://outlook.office.com/api/{version}/me/findmeetingtimes"
    const data = {};
    axios.post('schedule/meeting', data);
  }

  render() {
    return (
      <div>

      <button onClick={this.findMeetingTimes}>Test</button>




        <h1 className="settings-title">Settings</h1>
        <div className="container">
          <p>Add New User</p>
          <Button onClick={this.findMeetingTimes}>Test</Button>

          <img id="logo" src={logo}>
          </img>
          <form>
            <TextField className="input-box"
              id="standard-name"
              label="First Name"
              margin="normal"
            />

            <TextField className="input-box"
              id="standard-name"
              label="Last Name"
              margin="normal"
            />


            <TextField className="input-box"
              id="standard-name"
              label="Email"
              margin="normal"
            />

            <TextField className="input-box"
              id="standard-name"
              label="Role"
              margin="normal"
            />
          </form>
          <Button className="btn-submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </div>
    )
  }
}

export default SettingsPage;
