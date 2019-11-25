import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
} from '@material-ui/core';
import { connect } from 'react-redux';
import AvailabilityTable from "./AvailabilityTable.jsx"

import logo_long from '../../images/galvanize_long.png';
import background from '../../images/background.jpg';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true,
});

const styles = {
  wrapper: {
    height: window.innerHeight,
    textAlign: 'center',
    background: `url(${background}) no-repeat center center fixed`,
    backgroundSize: 'cover',
  },
  title: {
    marginLeft: '30px',
    fontWeight: 'normal',
  },
  container: {
    display: 'inline-block',
    border: '4px solid grey',
    margin: 'auto 30px auto auto',
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
  paper: {
    width: '700px',
    display: 'block',
    margin: 'auto',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
    height: 'fit-content',
    padding: '30px',
  }
};

class AddAvailability extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { actions, uuid } = this.props;
    await actions.getCandidate(uuid);
  }

  handleSubmit = async (times) => {
    // Add on the candidate name to the times
    const { actions } = this.props;

    const availability = times.map(time => ({
      startTime: time.start.toISOString().slice(0, 19).replace('T', ' '),
      endTime: time.end.toISOString().slice(0, 19).replace('T', ' ')
    }))

    const response = await actions.sendAvailability(availability, this.props.uuid);

    if (response && response.error) return;

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
        <Paper className={classes.paper} square>
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
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(AddAvailability);
