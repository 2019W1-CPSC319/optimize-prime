import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import AvailabilityTable from "./AvailabilityTable.jsx"

import logo_long from '../../images/galvanize_long.png';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true,
});

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
  }

  async componentDidMount() {
    const { actions, uuid } = this.props;
    debugger;
    // actions.getUsers('candidate');
    await actions.getCandidate(uuid);
  }

  handleSubmit = async (times) => {
    // Add on the candidate name to the times
    const { actions } = this.props;

    const availability = times.map(time => ({
      startTime: time.start.toISOString().slice(0, 19).replace('T', ' '),
      endTime: time.end.toISOString().slice(0, 19).replace('T', ' ')
    }))

    await actions.sendAvailability(availability, this.props.uuid);
    swalWithBootstrapButtons.fire(
      'Successfully submitted!',
      'We\'ll get back to you with an interview invitation in the next few days.',
      'success',
    ).then(result => {
      window.location.reload();
    });
  }

  render() {
    const { classes, candidate } = this.props;
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" className={classes.title}>
          Add Interview Availability
        </Typography>
        <div className={classes.container}>
          <img className={classes.bigLogo} src={logo_long} alt="Galvanize Logo" />
          <div className={classes.subText}>
            <Typography>{`Hi ${candidate ? candidate.firstName : ''}, `}</Typography>
            <Typography>
              Please add your availability to come in for an on-site interview at our <b>Vancouver</b> office below.
            </Typography>
            <Typography>
              Start off by adding when you'll be free in the next month and we'll get back to you if we need any more info.
            </Typography>
          </div>
          <AvailabilityTable submitHandler={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AddAvailability);
