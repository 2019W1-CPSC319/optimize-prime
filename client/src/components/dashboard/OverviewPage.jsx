import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as user from "../../actions/userActions";

class OverviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const {userProfile} = this.props
    return (
      <div>
        {userProfile && <h2>Welcome, {userProfile.givenName}</h2>}
      </div>
    );
  };
};

export default connect((state) => ({
  userProfile: user.getUserProfile(state),
  loading: user.isLoading(state),
  hasTriedLogin: user.hasTriedLogin(state)
}), (dispatch) => ({
  fetchUserProfile: () => dispatch(user.fetchUser())
}))(OverviewPage);
