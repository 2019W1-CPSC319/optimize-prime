import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import * as user from "../../actions/userActions";

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

  render() {
    const { classes, ...userProfile } = this.props
    return (
      <div>
        {userProfile && <h1 className={classes.title}>Welcome, {userProfile.givenName}</h1>}
      </div>
    );
  };
};

export default withStyles(styles)(connect((state) => ({
  userProfile: user.getUserProfile(state),
  loading: user.isLoading(state),
  hasTriedLogin: user.hasTriedLogin(state)
}), (dispatch) => ({
  fetchUserProfile: () => dispatch(user.fetchUser())
}))(OverviewPage));
