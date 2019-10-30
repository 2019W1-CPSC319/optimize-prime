import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as user from '../../selectors/AuthSelector';
import * as userActions from '../../actions/userActions';

const styles = {
  title: {
    fontWeight: 'normal',
    marginLeft: '30px',
  },
}

class OverviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleChange = (e) => {
    this.setState({
    [e.target.id]: e.target.value
    })
  }

  sendEmail = () => {
    this.props.sendEmail(this.state.subject, this.state.body);
  }

  render() {
    const { classes, userProfile } = this.props
    return (
      <div>
        <div className={clsx(classes.header, classes.flex)}>
          {userProfile && <h1 className={classes.title}>Welcome, {userProfile.givenName}</h1>}
        </div>
        <div>
          <input type='input' id="subject" onChange={(e) => this.handleChange(e)} value={this.state.subjec} placeholder="Email Subject" />
          <input type='input' id="body" onChange={(e) => this.handleChange(e)} value={this.state.subjec} placeholder="Email body"/>
          <button onClick={this.sendEmail}>Send email</button>
        </div>
      </div>
    );
  };
};

const mapStateToProps = (state) => ({
  userProfile: user.getUserProfile(state),
  loading: user.isLoading(state),
  hasTriedLogin: user.hasTriedLogin(state),
});

const mapDispatchToProps = (dispatch) => ({
  sendEmail: (subject, body) => dispatch(userActions.sendEmail(subject, body))
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(OverviewPage));
