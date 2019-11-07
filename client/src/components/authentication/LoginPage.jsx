import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import company from '../../images/galvanize_long.png';
import galvanize from '../../images/galvanize.png';
import microsoft from '../../images/microsoft.png';
import {
  Typography,
} from '@material-ui/core';

const styles = {
  button: {
    borderRadius: '5px',
    color: '#ffffff',
    display: 'flex',
    padding: '5px 10px',
    margin: '10px auto',
  },
  company: {
    display: 'block',
    margin: '200px auto 50px',
    width: '300px',
  },
  divider: {
    height: '35px',
    width: '1px',
    backgroundColor: '#ffffff',
    margin: 'auto 10px',
  },
  guest: {
    backgroundColor: '#000',
    padding: '15px 0',
    width: '320px',
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
  noIconText: {
    margin: 'auto',
  },
  help: {
    textAlign: 'center',
    fontSize: '12px'
  },
  highlight: {
    color: '#483d8b',
    marginLeft: '10px',
  },
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { classes } = this.props;

    const signinLocation = window.location.host + "/auth/signin";

    return (
      <div>
        <div >
          <img className={classes.company} src={company} alt={'Galvanize Logo'} />
          <button className={`${classes.button} ${classes.microsoft}`} onClick={() => window.location.assign("/auth/signin")}>
            <img src={microsoft} className={classes.logo} alt={'Microsoft Logo'} />
            <div className={classes.divider}></div>
            <p className={classes.text}>Sign in with Microsoft Account</p>
          </button>
          <Typography align="center">or</Typography>
          <button className={clsx(classes.button, classes.guest)}>
            <p className={classes.noIconText}>Sign in with Guest Account</p>
          </button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(LoginPage));
