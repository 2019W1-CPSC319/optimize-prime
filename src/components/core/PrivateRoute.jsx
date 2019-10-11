import React from 'react';
import { Route } from 'react-router-dom';
import { Redirect, withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Icon,
  IconButton,
} from '@material-ui/core';

// Component constants
const NAVIGATION_OPTIONS = [
  {
    key: 'user', title: 'User Account', path: '/user', icon: 'account_circle',
  },
  {
    key: 'overview', title: 'Overview', path: '/', icon: 'home',
  },
  {
    key: 'calendar', title: 'Calendar', path: '/calendar', icon: 'calendar_today',
  },
  {
    key: 'directory', title: 'Manage Accounts', path: '/directory', icon: 'people',
  },
];

// Styles
const SIDEBAR_WIDTH = 60;

const styles = {
  sideBar: {
    position: 'fixed',
    padding: '5px',
    backgroundColor: '#f0a017',
  },
  pageContent: {
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    marginLeft: `${SIDEBAR_WIDTH}px`,
  },
  selectedIconButton: {
    color: '#765ea8',
  },
  iconButton: {
    color: '#ffffff',
  },
};

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onClickSignout = () => {
    const { pageProps, history } = this.props;
    const { actions } = pageProps;
    actions.logoutUser();
    history.push('/login');
  }

  onClickNavigate = (event, option) => {
    const { pageProps, history } = this.props;
    const { actions } = pageProps;
    const { key, path } = option;

    actions.updateNavigator(key);

    history.push(path);
  }

  renderSideBar = () => {
    const { path, classes, pageProps } = this.props;
    const { nav } = pageProps;
    const { currentPage } = nav;

    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.sideBar,
        }}
      >
        {
          NAVIGATION_OPTIONS.map(option => {
            const { key, icon } = option;
            const isSelected = key === currentPage;
            return (
              <IconButton
                key={key}
                onClick={(e) => this.onClickNavigate(e, option)}
                className={isSelected ? classes.selectedIconButton : classes.iconButton}
              >
                <Icon>{icon}</Icon>
              </IconButton>
            );
          })
        }
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
    // if (!pageProps.user) {
    //   return (
    //     <Redirect to="/login" />
    //   );
    // }

    return (
      <Route
        {...routeProps}
        render={() => this.renderRoute()}
      />
    );
  }
}

export default withStyles(styles)(withRouter(PrivateRoute));
