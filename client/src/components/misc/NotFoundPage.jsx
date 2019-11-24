import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import not_found from '../../images/not_found_with_text.png';

const styles = {
  root: {
    backgroundColor: '#EBE4F6',
    height: window.innerHeight
  },
  img: {
    width: '500px',
    margin: 'auto',
    padding: '200px',
    display: 'block',
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
        <img src={not_found} className={classes.img} />
      </div>
    )
  }
}

export default withStyles(styles)(NotFoundPage);
