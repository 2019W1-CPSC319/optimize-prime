import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import svg from '../../images/undraw_moonlight_5ksn.svg';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  errorText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  title: {
    textAransform: 'uppercase',
  },
  subtitle: {
    textAransform: 'uppercase',
  },
  svg: {
    width: '250px',
  }
};

class NotFoundPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.errorText}>
          <Typography className={classes.title} variant="h3">404</Typography>
          <Typography className={classes.subtitle} variant="h5">Not Found</Typography>
        </div>
        <img
          src={svg}
          className={classes.svg}
        />
      </div>
    );
  }
}

export default withStyles(styles)(NotFoundPage);
