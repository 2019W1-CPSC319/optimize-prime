import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions/index';
import PrivateRoute from './components/core/PrivateRoute';
import LoginPage from './components/authentication/LoginPage';
import CandidatePage from './components/candidate/AddAvailability';
import OverviewPage from './components/dashboard/OverviewPage';
import CalendarPage from './components/calendar/CalendarPage';
import RoomPage from './components/room/RoomPage';
import DirectoryPage from './components/directory/DirectoryPage';
import SettingsPage from './components/settings/SettingsPage';

const App = props => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" render={() => <LoginPage {...props} />} />
      <Route exact path="/candidate" render={() => <CandidatePage {...props} />} />
      <PrivateRoute exact path="/" pageProps={props} render={() => <OverviewPage {...props} />} />
      <PrivateRoute exact path="/calendar" pageProps={props} render={() => <CalendarPage {...props} />} />
      <PrivateRoute exact path="/room" pageProps={props} render={() => <RoomPage {...props} />} />
      <PrivateRoute exact path="/directory" pageProps={props} render={() => <DirectoryPage {...props} />} />
      <PrivateRoute exact path="/settings" pageProps={props} render={() => <SettingsPage {...props} />} />
    </Switch>
  </BrowserRouter>
);

const mapStateToProps = state => ({
  user: state.user,
  candidates: state.directory.candidates,
  interviewers: state.directory.interviewers,
  rooms: state.rooms.rooms,
  outlookRooms: state.rooms.outlookRooms,
  meetingSuggestions: state.user.meetingSuggestions,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
