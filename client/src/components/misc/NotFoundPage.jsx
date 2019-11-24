import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { default as SVG } from 'react-svg';
import svg from '../../images/undraw_access_denied_6w73.svg';

const styles = {
  root: {
    height: window.innerHeight,
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    textAransform: 'uppercase',
    top: '200px',
    left: '88px',
    right: 0,
    bottom: 0,
    margin: 'auto'
  },
  subtitle: {
    position: 'absolute',
    textAlign: 'center',
    textAransform: 'uppercase',
    top: '250px',
    left: '88px',
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
    width: '300px',
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
        <SVG
          src={svg}
          beforeInjection={svg => {
            svg.setAttribute('style', 'display: block; margin: auto; position: absolute; top: 0; right: 0; left: 88px; bottom: 0; width: 250px;');
          }}
        />
        <Typography className={classes.title} variant='h3'>404</Typography>
        <Typography className={classes.subtitle} variant='h5'>Not Found</Typography>
      </div>
    )
  }
}

export default withStyles(styles)(NotFoundPage);
