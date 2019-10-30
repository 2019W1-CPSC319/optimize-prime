import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import AvailabilityTable from "./AvailabilityTable.jsx"

import logo_long from '../../images/galvanize_long.png';

const styles = {
  wrapper: {
    textAlign: 'center',
  },
  title: {
    marginLeft: '30px',
    fontWeight: 'normal',
  },
  container: {
    display: 'inline-block',
    border: '4px solid grey',
    margin: 'auto',
    maxWidth: '70%',
    maxHeight: '100%',
    borderRadius: '20px',
    textAlign: 'center',
  },
  subText: {
    margin: 'auto 30px',
    fontWeight: 'normal',
    textAlign: 'start',
  },
  bigLogo: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
    marginTop: '16px',
  },
};

class AddAvailability extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'John Doe',
    };
  }

  render() {
    const { classes } = this.props;
    const { name } = this.state;

    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" className={classes.title}>
          Add Interview Availability
        </Typography>
        <div className={classes.container}>
          <img className={classes.bigLogo} src={logo_long} alt="Galvanize Logo" />
          <div className={classes.subText}>
            <Typography>{`Hi ${name}, `}</Typography>
            <Typography>
              Please add your availability to come in for an on-site interview at our <b>Vancouver</b> office below.
            </Typography>
            <Typography>
              Start off by adding when you'll be free in the next month and we'll get back to you if we need any more info.
            </Typography>
          </div>
          <AvailabilityTable />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AddAvailability);
