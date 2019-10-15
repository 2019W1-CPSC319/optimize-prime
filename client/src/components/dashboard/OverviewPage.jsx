import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as user from "../../actions/userActions";

class OverviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    if(!this.props.user) {
      console.log("heh")
      this.props.fetchUserProfile();
    }
  }

  render() {

    const {user, loading } = this.props

    if(this.props.loading) {
      return <div>Loading profile</div>;
    }
    return (
      <div>
        {this.props.user && <h2>Welcome, {user.givenName}</h2>}
      </div>
    );
  };
};

export default connect((state) => ({
  user: user.getUserProfile(state),
  loading: user.isLoading(state)
}), (dispatch) => ({
  fetchUserProfile: () => dispatch(user.fetchUser())
}))(OverviewPage);
