import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import {
  Badge,
  Drawer,
  Icon,
  IconButton,
} from '@material-ui/core';

import logo from '../../images/galvanize.png';

// Component constants
const NAVIGATION_OPTIONS = [
  {
    key: 'notifications', title: 'Notifications', path: '/', icon: 'notifications',
  },
  {
    key: 'overview', title: 'Overview', path: '/', icon: 'home',
  },
  {
    key: 'calendar', title: 'Calendar', path: '/calendar', icon: 'calendar_today',
  },
  {
    key: 'room', title: 'Room', path: '/room', icon: 'room',
  },
  {
    key: 'directory', title: 'Manage Accounts', path: '/directory', icon: 'people',
  },
  {
    key: 'settings', title: 'Settings', path: '/settings', icon: 'build',
  },
];

// Styles
const SIDEBAR_WIDTH = 88;

const styles = {
  sideBar: {
    position: 'fixed',
    padding: '20px',
    backgroundColor: '#280e3a',
  },
  pageContent: {
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    marginLeft: `${SIDEBAR_WIDTH}px`,
  },
  logo: {
    width: '48px',
    margin: '0 0 15px',
  },
  selectedIconButton: {
    color: '#280e3a',
    backgroundColor: '#ffffff',
    margin: '15px 0',
    '&:hover': {
      backgroundColor: "#ffffff",
    },
  },
  iconButton: {
    color: '#ffffff',
    margin: '15px 0',
    '&:hover': {
      color: '#280e3a',
      backgroundColor: "#ffffff",
    },
  },
};

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const { pageProps } = this.props

    if (!pageProps.user.profile) {
      // pageProps.actions.fetchUser();
    }
  }

  onClickSignout = () => {
    const { pageProps, history } = this.props;
    const { actions } = pageProps;
    actions.logoutUser();
    history.push('/login');
  }

  onClickNavigate = (event, option) => {
    const { history } = this.props;
    const { path } = option;

    history.push(path);
  }

  onClickLogout = () => {
    window.location.assign('/auth/signout');
  }

  renderSideBar = () => {
    const { path, classes } = this.props;

    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.sideBar,
        }}
      >
        <img src={logo} className={classes.logo} alt="logo" />
        {
          NAVIGATION_OPTIONS.map(option => {
            const { key, icon } = option;
            const isSelected = option.path === path && key !== 'notifications';

            return (
              <IconButton
                key={key}
                onClick={(e) => this.onClickNavigate(e, option)}
                className={isSelected ? classes.selectedIconButton : classes.iconButton}
              >
                <Badge className={classes.margin} variant="dot" badgeContent={key === 'notifications' ? 1 : 0} color="secondary">
                  <Icon>{icon}</Icon>
                </Badge>
              </IconButton>
            );
          })
        }
        <IconButton className={classes.iconButton} onClick={() => this.onClickLogout()}>
          <Icon>exit_to_app</Icon>
        </IconButton>
      </Drawer>
    );
  }

  renderPageContent = () => {
    const { classes, render } = this.props;

    return (
      <div className={classes.pageContent}>
        {render()}
      </div>
    );
  }

  renderRoute = () => (
    <div>
      {this.renderSideBar()}
      {this.renderPageContent()}
    </div>
  )

  render() {
    const { classes, render, pageProps, ...routeProps } = this.props;

    // TODO: Uncomment when login is properly set up
    // if (!pageProps.user.profile && !pageProps.user.loading) {
    //   return (
    //     <Redirect to="/login" />
    //   );
    // }
    // if (pageProps.user.loading || !pageProps.user.hasTriedLogin) {
    //   return <div>Loading</div>;
    // };

    // if (!pageProps.user.profile) {
    //   return (
    //     <Redirect to='/login' />
    //   );
    // };


    return (
      <Route
        {...routeProps}
        render={() => this.renderRoute()}
      />
    );
  }
}

export default withStyles(styles)(withRouter(PrivateRoute));
