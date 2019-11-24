import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from './actions/index';
import PrivateRoute from './components/core/PrivateRoute';
import LoginPage from './components/authentication/LoginPage';
import CandidatePage from './components/candidate/CandidatePage';
import OverviewPage from './components/dashboard/OverviewPage';
import CalendarPage from './components/calendar/CalendarPage';
import RoomPage from './components/room/RoomPage';
import DirectoryPage from './components/directory/DirectoryPage';
import SettingsPage from './components/settings/SettingsPage';
import NotFoundPage from './components/misc/NotFoundPage';
import UnauthorizedPage from './components/misc/UnauthorizedPage';

const App = props => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" render={() => <LoginPage {...props} />} />
      <Route exact path="/unauthorized" render={() => <UnauthorizedPage {...props} />} />
      <Route exact path="/candidate" render={(routeProps) => <CandidatePage {...props} uuid={new URLSearchParams(routeProps.location.search).get('key')} />} />
      <PrivateRoute exact path="/" pageProps={props} render={() => <OverviewPage {...props} />} />
      <PrivateRoute exact path="/calendar" pageProps={props} render={() => <CalendarPage {...props} />} />
      <PrivateRoute exact path="/room" pageProps={props} render={() => <RoomPage {...props} />} />
      <PrivateRoute exact path="/directory" pageProps={props} render={() => <DirectoryPage {...props} />} />
      <PrivateRoute exact path="/settings" pageProps={props} render={() => <SettingsPage {...props} />} />
      <PrivateRoute path="*" pageProps={props} render={() => <NotFoundPage {...props} />} />
    </Switch>
  </BrowserRouter>
);

const mapStateToProps = state => ({
  user: state.user,
  candidate: state.directory.candidate,
  meetingSuggestions: state.user.meetingSuggestions,
  interviews: state.user.interviews,
  candidates: state.directory.candidates,
  interviewers: state.directory.interviewers,
  administrators: state.directory.administrators,
  template: state.directory.template,
  rooms: state.rooms.rooms,
  outlookRooms: state.rooms.outlookRooms,
  meetingSuggestions: state.user.meetingSuggestions,
  interviews: state.user.interviews,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
