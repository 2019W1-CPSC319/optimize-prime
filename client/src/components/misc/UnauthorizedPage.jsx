import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { default as SVG } from 'react-svg';
import svg from '../../images/undraw_moonlight_5ksn.svg';

const styles = {
  root: {
    height: window.innerHeight
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    textAransform: 'uppercase',
    top: '300px',
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto'
  },
  subtitle: {
    position: 'absolute',
    textAlign: 'center',
    textAransform: 'uppercase',
    top: '350px',
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto'
  },
  svg: {
    display: 'block',
    margin: 'auto',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: '500px',
  }
};

class UnauthorizedPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <SVG
          src={svg}
          beforeInjection={svg => {
            svg.setAttribute('style', 'display: block; margin: auto; position: absolute; top: 0; right: 0; left: 0; bottom: 0; width: 250px;');
          }}
        />
        <Typography className={classes.title} variant='h3'>401</Typography>
        <Typography className={classes.subtitle} variant='h5'>Unauthorized</Typography>
      </div>
    )
  }
}

export default withStyles(styles)(UnauthorizedPage);
