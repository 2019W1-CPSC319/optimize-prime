import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import company from '../../images/galvanize_long.jpg';
import galvanize from '../../images/galvanize.png';
import microsoft from '../../images/microsoft.png';

const styles = {
  button: {
    borderRadius: '5px',
    color: '#ffffff',
    display: 'flex',
    padding: '5px 10px',
    margin: 'auto',
  },
  company: {
    display: 'block',
    margin: 'auto',
    width: '300px',
  },
  divider: {
    height: '35px',
    width: '1px',
    backgroundColor: '#ffffff',
    margin: 'auto 10px',
  },
  galvanize: {
    backgroundColor: '#280e3a',
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
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { classes } = this.props;
    return <div>
      <div>
        <img className={classes.company} src={company}></img>
        <button className={`${classes.button} ${classes.galvanize}`}>
          <img src={galvanize} className={classes.logo}></img>
          <div className={classes.divider}></div>
          <p className={classes.text}>Sign in with Galvanize Account</p>
        </button>
        <button className={`${classes.button} ${classes.microsoft}`}>
          <img src={microsoft} className={classes.logo}></img>
          <div className={classes.divider}></div>
          <p className={classes.text}>Sign in with Microsoft Account</p>
        </button>
      </div>
    </div>;
  }
}

export default withStyles(styles)(withRouter(LoginPage));
