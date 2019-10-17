import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as user from "../../actions/userActions";
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

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
        <div className={clsx(classes.header, classes.flex)}>
          {userProfile && <h1 className={classes.title}>Welcome, {userProfile.givenName}</h1>}
        </div>
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
