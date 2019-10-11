import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions/index';
import LoginPage from './components/authentication/LoginPage';

const App = props => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" render={() => <LoginPage {...props} />} />
    </Switch>
  </BrowserRouter>
);

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);