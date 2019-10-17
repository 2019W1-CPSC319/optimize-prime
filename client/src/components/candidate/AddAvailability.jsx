import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import AvailabilityTable from "./AvailabilityTable.jsx"

import './AddAvailability.css';
import logo_long from '../../images/galvanize_long.png';

class AddAvailability extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="availability-wrapper">
        <h1 className="availability-title">
          Add Interview Availability
        </h1>
        <div className="availability-container">


        <img className="big-logo" src={logo_long} alt="Galvanize Logo">
        </img>

        <h3 className="availability-subtext">
          <p>Hi <b>[Name]</b>, </p>
          <p>
          Please add your availability to come in for an on-site interview at our <b>Vancouver</b> office below.
          </p><p>
          Start off by adding when you'll be free in the next month and we'll get back to you if we need any more info.
          </p>
        </h3>
        <AvailabilityTable>

        </AvailabilityTable>
        </div>
      </div>

    );
  }
}

export default AddAvailability;
