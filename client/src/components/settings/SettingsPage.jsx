import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './settingsPage.css';
import logo from '../../images/galvanize.png';
import axios from 'axios';
import { Input } from '@material-ui/core';
import Swal from 'sweetalert2'

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.addNewUser = this.addNewUser.bind(this);
    this.state = {
    };
  }

  addNewUser(event) {
    event.preventDefault();
    let formData = {
      FirstName: event.target[0].value,
      LastName: event.target[1].value,
      Email: event.target[2].value,
      Phone: event.target[3].value,
      Role: event.target[4].value
    }
    axios.post('/schedule/newuser', formData).then(res => {
      Swal.fire(
        'Success',
        'Successfully added new user',
        'success'
      )
      });

  }

  render() {
    return (
      <div>
        <h1 className="settings-title">Settings</h1>
        <div className="container">
          <p>Add New User</p>
          <img id="logo" src={logo}>
          </img>
          <form onSubmit={this.addNewUser}>
            <TextField className="input-box"
              id="standard-name"
              label="First Name"
              name="First Name"
              margin="normal"
            />

            <TextField className="input-box"
              id="standard-name"
              label="Last Name"
              name="Last Name"
              margin="normal"
            />


            <TextField className="input-box"
              id="standard-name"
              label="Email"
              name="Email"
              margin="normal"
            />

            <TextField className="input-box"
              id="standard-name"
              label="Phone"
              name="Phone"
              margin="normal"
            />

            <TextField className="input-box"
              id="standard-name"
              label="Role"
              name="Role"
              margin="normal"
            />
            <Button type="submit" className="btn-submit" variant="contained" color="primary">
              Submit
          </Button>
          </form>
        </div>
      </div>
    )
  }
}

export default SettingsPage;
