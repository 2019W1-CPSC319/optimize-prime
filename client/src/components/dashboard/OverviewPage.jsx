import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Divider,
  IconButton,
  Icon
} from '@material-ui/core';

import * as user from '../../selectors/AuthSelector';
import { ALLOWED_USER_ACTIONS, swalWithBootstrapButtons } from '../directory/DirectoryPage';
import CandidateTable from './subComponents/CandidateTable';

const styles = {
  title: {
    fontWeight: 'normal',
    marginLeft: '30px',
  },
  content: {
    margin: 'auto 30px',
    flex: 2,
  },
  schedule: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
  },
  date: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  year: {
    fontSize: '10px',
  },
  month: {
    fontSize: '14px',
  },
  day: {
    fontSize: '16px',
  },
  time: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
  },
  center: {
    display: 'block',
    margin: 'auto',
    width: '300px',
    '&:not(:last-child)': {
      marginBottom: '10px',
    }
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '330px',
    marginRight: '30px',
    padding: '15px 0',
    alignSelf: 'flex-start',
  },
}

class OverviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: [],
      unready: []
    };
  }

  async componentDidMount() {
    const { actions } = this.props;
    await actions.getUsers('candidate');
    await actions.getInterviews();
    const { candidates } = this.props;
    const ready = candidates.filter(candidate => candidate.submittedAvailability === 'T');
    const unready = candidates.filter(candidate => candidate.submittedAvailability === 'F');
    this.setState({ ready, unready });
  }

  refresh = async () => {
    const { actions } = this.props;
    await actions.getInterviews();
  }

  onClickUserAction = (mode, userId) => {
    if (!ALLOWED_USER_ACTIONS.includes(mode)) return;
    const { actions } = this.props;

    if (mode === 'mail') {
      const { candidates } = this.props;
      const candidate = candidates.find(c => c.id === userId);
      if (!candidate) return;
      const {
        firstName,
        lastName,
        email,
        phone,
        role,
      } = candidate;
      swalWithBootstrapButtons.fire({
        text: "Do you want to send an email to collect candidate\'s availability?",
        type: 'success',
        showCancelButton: true,
        confirmButtonText: 'Send Email',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then(async (result) => {
        const { value } = result;
        if (value) {
          const response = await actions.sendEmail({
            firstName,
            lastName,
            email,
            phone,
            role,
          });
          if (response && !response.error) {
            swalWithBootstrapButtons.fire(
              'Email is sent!',
              'You\'re all set.',
              'success'
            );
          }
        }
      });
    }
  }

  render() {
    const { classes, userProfile, interviews, user } = this.props;
    const { ready, unready } = this.state;
    return (
      <div>
        {
          userProfile &&
          <h1 className={classes.title}>
            Welcome, {userProfile.givenName}
          </h1>
        }
        <Box component='div' display='flex'>
          <Box className={classes.content}>
            <Typography variant='h6' style={{ marginBottom: '10px' }}>Candidates with Availability</Typography>
            <CandidateTable
              onClickUserAction={this.onClickUserAction}
              rows={ready}
              mode='ready'
            />
            <Typography variant='h6' style={{ marginBottom: '10px', marginTop: '35px' }}>Candidates with Missing Availability</Typography>
            <CandidateTable
              onClickUserAction={this.onClickUserAction}
              rows={unready}
              mode='unready'
            />
          </Box>
          <Box className={classes.sidebar}>
            <Box component='div' display='flex' style={{ justifyContent: 'space-between' }}>
              <Typography variant='h6' style={{ margin: 'auto', marginLeft: '15px' }}>Upcoming Interviews</Typography>
              <IconButton onClick={this.refresh}>
                <Icon>refresh</Icon>
              </IconButton>
            </Box>
            {
              !user.interviewsLoading
                ? (
                  interviews && interviews.slice(0, 7).map((option, key) => {
                    const date = new Date(option.startTime);
                    const startTime = moment(option.startTime).format('h:mm A');
                    const endTime = moment(option.endTime).format('h:mm A')
                    return (
                      <div key={key} className={classes.center}>
                        <Paper className={classes.schedule}>
                          <div className={classes.date}>
                            <Typography className={classes.year}>{moment(date).format('YYYY')}</Typography>
                            <Typography className={classes.month}>{moment(date).format('MMM')}</Typography>
                            <Typography className={classes.day}>{moment(date).format('DD')}</Typography>
                          </div>
                          <Divider orientation="vertical" />
                          <div className={classes.time}>
                            <Typography>{option.candidate.firstName + " " + option.candidate.lastName}</Typography>
                            <Typography>{startTime} - {endTime}</Typography>
                            <Typography>{option.room.name}</Typography>
                          </div>
                        </Paper>
                      </div>
                    );
                  })
                )
                : <CircularProgress />
            }
          </Box>
        </Box>
      </div>
    );
  };
};

const mapStateToProps = (state) => ({
  userProfile: user.getUserProfile(state),
  loading: user.isLoading(state),
  hasTriedLogin: user.hasTriedLogin(state),
});

export default withStyles(styles)(connect(mapStateToProps)(OverviewPage));
