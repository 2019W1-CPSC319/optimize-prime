import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as candidateActions from '../../actions/candidateActions';
import * as candidateSelectors from '../../selectors/CandidateSelectors';

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

  componentDidMount(){
    if(!this.props.candidate){
      this.props.fetchCandidate(this.props.id);
    }
  }

  render() {
    const { classes, candidate } = this.props;
    const { name } = this.state;
    if(!this.props.candidate) {
      return <div>Loading</div>
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
          <AvailabilityTable />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  candidate: candidateSelectors.getCandidateById(state, ownProps.id)
})

const mapDispatchToProps = (dispatch) => ({
  fetchCandidate: (id) => dispatch(candidateActions.fetchSpecificCandidate(id))
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddAvailability));
