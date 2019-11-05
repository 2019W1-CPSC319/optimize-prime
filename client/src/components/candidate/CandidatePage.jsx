import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as candidateActions from '../../actions/candidateActions';
import * as candidateSelectors from '../../selectors/CandidateSelectors';

import Swal from 'sweetalert2'

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
      success: false
    };
  }

  componentDidMount(){
    if(!this.props.candidate){
      this.props.fetchCandidate(this.props.id);
    }
  }

  handleSubmit = (times) => {
    // Add on the candidate name to the times
    const availability = {
      uuid: this.props.candidate.uuid,
      startTime: times[0].start.toISOString().slice(0, 19).replace('T', ' '),
      endTime: times[0].end.toISOString().slice(0, 19).replace('T', ' ')
    };
    this.props.sendAvailability(availability);
  }

  render() {
    const { classes, candidate } = this.props;
    const { name } = this.state;
    if(!this.props.candidate) {
      return <div>Loading</div>
    }
    if(this.state.success) {
      Swal.fire({
        type: "success",
        title: "Your availability has been submitted!",
        text: "We'll get back to you with an interview invitation in the next few days.",
        showConfirmButton: false,
        timer: 10000
      });
    }
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" className={classes.title}>
          Add Interview Availability
        </Typography>
        <div className={classes.container}>
          <img className={classes.bigLogo} src={logo_long} alt="Galvanize Logo" />
          <div className={classes.subText}>
            <Typography>{`Hi ${candidate.firstName}, `}</Typography>
            <Typography>
              Please add your availability to come in for an on-site interview at our <b>Vancouver</b> office below.
            </Typography>
            <Typography>
              Start off by adding when you'll be free in the next month and we'll get back to you if we need any more info.
            </Typography>
          </div>
          <AvailabilityTable submitHandler={this.handleSubmit}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  candidate: candidateSelectors.getCandidateById(state, ownProps.id),
  success: state.success
})

const mapDispatchToProps = (dispatch) => ({
  fetchCandidate: (id) => dispatch(candidateActions.fetchSpecificCandidate(id)),
  sendAvailability: (id) => dispatch(candidateActions.sendAvailability(id))
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddAvailability));
