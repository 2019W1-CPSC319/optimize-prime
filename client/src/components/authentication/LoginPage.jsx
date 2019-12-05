import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import company from '../../images/galvanize_long.png';
import microsoft from '../../images/microsoft.png';
import clsx from 'clsx';

const styles = {
  button: {
    borderRadius: '5px',
    color: '#ffffff',
    display: 'flex',
    padding: '5px 10px',
    margin: '10px auto',
  },
  company: {
    margin: 'auto',
    display: 'block',
    width: '300px',
  },
  divider: {
    height: '35px',
    width: '1px',
    backgroundColor: '#ffffff',
    margin: 'auto 10px',
  },
  logo: {
    width: '25px',
    margin: 'auto',
  },
  microsoft: {
    backgroundColor: '#3f51b5',
  },
  text: {
    margin: 'auto 50px',
  },
  center: {
    height: '300px',
    display: 'block',
    margin: 'auto',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
  }
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.center}>
          <img className={clsx(classes.company)} src={company} alt={'Galvanize Logo'} />
          <button className={clsx(classes.button, classes.microsoft)} onClick={() => window.location.assign("/auth/signin")}>
            <img src={microsoft} className={classes.logo} alt={'Microsoft Logo'} />
            <div className={classes.divider}></div>
            <p className={classes.text}>Sign in with Microsoft Account</p>
          </button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(LoginPage));
