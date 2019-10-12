import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  title: {
    fontWeight: 'normal',
    marginLeft: '30px',
  },
  calendar: {
    display: 'flex',
    margin: '0 10px',
    height: '700px',
  },
  component: {
    width: 'calc(100% / 7)',
    textAlign: 'center',

    color: '#fff',
    height: 'fit-content',
  },
  label: {
    padding: '7.5px 0',
    backgroundColor: '#280e3a',
  },
  bar: {
    width: '5px',
    height: '84px',
    backgroundColor: '#e91e63',
    borderRadius: '15px',
  },
  detail: {
    color: '#000',
    fontSize: '12px',
    textAlign: 'left',
    lineHeight: '1',
    marginLeft: '10px',
  },
  event: {
    display: 'flex',
  }
};

class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { classes } = this.props;
    return <div>
      <h1 className={classes.title}>Calendar</h1>
      <div className={classes.calendar}>
        <div className={classes.component}>
          <p className={classes.label}>Sunday</p>
          <div className={classes.event}>
            <div className={classes.bar}></div>
            <div className={classes.detail}>
              <p>2:00 PM - 2:45 PM</p>
              <p>John Doe</p>
              <p>UI/UX Team</p>
            </div>
          </div>
        </div>
        <div className={classes.component}><p className={classes.label}>Monday</p></div>
        <div className={classes.component}><p className={classes.label}>Tuesday</p></div>
        <div className={classes.component}><p className={classes.label}>Wednesday</p></div>
        <div className={classes.component}><p className={classes.label}>Thursday</p></div>
        <div className={classes.component}><p className={classes.label}>Friday</p></div>
        <div className={classes.component}><p className={classes.label}>Saturday</p></div>
      </div>
    </div>;
  }
}

export default withStyles(styles)(CalendarPage);
