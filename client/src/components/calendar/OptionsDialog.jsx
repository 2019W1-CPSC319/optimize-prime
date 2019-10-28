import React, { Component } from 'react';
import Moment from 'react-moment';
// import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
// import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
// import GroupIcon from '@material-ui/icons/Group';
// import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { green } from '@material-ui/core/colors';
import {
    Avatar,
    Button,
    Box,
    // Card,
    // CardContent,
    // Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    // ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    Radio,
    Popover,
} from '@material-ui/core';

const styles = theme => ({
    duration: {
        padding: '5px 30px',
        borderColor: '#765ea8',
    },
    chip: {
        marginRight: '5px',
    },
    avatar: {
        fontSize: 'x-small',
        width: '20px',
        height: '20px',
        backgroundColor: `${'#' + Math.floor(Math.random() * 16777215).toString(16)}`
    }
});

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);

const rooms = [
    { name: 'Room A' },
    { name: 'Room B' },
    { name: 'Room C' },
]

const blocks = [
    { id: 'Student A', start: '2019-10-22 09:00:00', end: '2019-10-22 12:00:00' },
    { id: 'Student A', start: '2019-10-22 14:00:00', end: '2019-10-22 17:00:00' },
    { id: 'Student D', start: '2019-10-22 09:00:00', end: '2019-10-22 17:00:00' },
]

const events = [
    { id: 'Room A', start: '2019-10-22 09:00:00', end: '2019-10-22 17:00:00' }, // busy all day
    { id: 'Room B', start: '2019-10-22 09:00:00', end: '2019-10-22 13:00:00' }, // available in the afternoon
    { id: 'Room C', start: '2019-10-22 12:00:00', end: '2019-10-22 17:00:00' }, // available in the morning
    { id: 'Employee A', start: '2019-10-22 14:00:00', end: '2019-10-22 17:00:00' },
    { id: 'Employee B', start: '2019-10-22 14:00:00', end: '2019-10-22 15:00:00' },
    { id: 'Employee C', start: '2019-10-22 09:00:00', end: '2019-10-22 17:00:00' },
]

class OptionsDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            background: props.background,
            color: props.color,
            required: props.required,
            optional: props.optional,
            candidate: props.candidate,
            popover: null,
            options: [{
                date: '2019-10-22',
                time: {
                    start: '12:00 PM',
                    end: '2:00 PM'
                },
                room: 'Room A',
                interviewers: ['Employee B', 'Employee C']
            },
            {
                date: '2019-10-28',
                time: {
                    start: '12:00 PM',
                    end: '2:00 PM'
                },
                room: 'Room A',
                interviewers: ['Employee A']
            },
            {
                date: '2019-10-29',
                time: {
                    start: '12:00 PM',
                    end: '2:00 PM'
                },
                room: 'Room A',
                interviewers: ['Employee D', 'Employee E']
            }],
        };
    }

    componentDidMount() {
        this.computeOptions();
    }

    computeOptions = () => {
        var availableOptions = [];
        var options = [];

        var blocksForCandidate =
            blocks.filter(block => block.id === this.props.candidate && this.canSchedule(block));

        const eventsRequiredInterviewers = events.filter(event => this.props.required.includes(event.id));

        blocksForCandidate
            .forEach(block => {
                var isAvailable = eventsRequiredInterviewers.filter(event => this.overlaps(event, block)).length === 0;
                if (isAvailable) {
                    availableOptions.push({
                        date: block.start.split(' ')[0],
                        time: { start: block.start, end: block.end },
                        rooms: new Set(),
                        interviewers: this.props.required,
                    });
                }
            });

        const eventsRooms = events.filter(event => event.id.startsWith('Room'));

        availableOptions
            .forEach(option => {
                const eventsGroupByRoom = this.groupBy(eventsRooms, 'id');
                // console.log('Group by: ' + JSON.stringify(eventsGroupByRoom));
                // console.log(Object.keys(eventsGroupByRoom));
                // const keys = Object.keys(eventsGroupByRoom);
                // keys.forEach(key => {
                //     const 
                // })
                eventsRooms.forEach(event => {
                    console.log(JSON.stringify(option.time))
                    console.log(JSON.stringify(event))
                    console.log(this.canSchedule(option.time, event));
                    if (this.canSchedule(option.time, event)) option.rooms.add(event.id);
                    // option.rooms.add({ room: event.id, startTime: computeStartTime(event, ) });
                });
            });

        console.log(JSON.stringify(availableOptions));

        availableOptions.forEach(availableOption => {
            console.log(JSON.stringify(availableOption));
            console.log(availableOption.rooms);
            availableOption.rooms.forEach(room => {
                var startTime = new Date(availableOption.time.start);
                var endTime = new Date(availableOption.time.end);
                console.log('Room: ' + room);
                console.log('Start time: ' + startTime)
                console.log('End time: ' + endTime)

                for (startTime; new Date(startTime.valueOf() + 1000 * 60 * this.props.durations[this.props.selected].minutes) <= endTime; startTime = new Date(startTime.valueOf() + 1000 * 60 * this.props.durations[this.props.selected].minutes)) {
                    console.log(startTime);
                    console.log(new Date(startTime.valueOf() + 1000 * 60 * this.props.durations[this.props.selected].minutes));
                    options.push({
                        date: availableOption.date,
                        time: { start: startTime, end: new Date(startTime.valueOf() + 1000 * 60 * this.props.durations[this.props.selected].minutes) },
                        room,
                        interviewers: availableOption.interviewers,
                    });
                }
            })
        });

        this.setState({ options: options });
    }

    overlaps = (a, b) => {
        console.log('a: ' + JSON.stringify(a));
        console.log('b: ' + JSON.stringify(b));
        var aStartDate = new Date(a.start);
        var aEndDate = new Date(a.end);
        var bStartDate = new Date(b.start);
        var bEndDate = new Date(b.end);
        console.log(aEndDate >= bStartDate && bEndDate >= aStartDate);
        return aEndDate >= bStartDate && bEndDate >= aStartDate;
    }

    canSchedule = (a, b) => {
        // console.log((new Date(block.end) - new Date(block.start)) / (1000 * 60) >= this.props.durations[this.props.selected].minutes);
        // return (new Date(block.end) - new Date(block.start)) / (1000 * 60) >= this.props.durations[this.props.selected].minutes;
        var aStartDate = new Date(a.start);
        var aEndDate = new Date(a.end);
        var bStartDate = new Date(b.start);
        var bEndDate = new Date(b.end);
        if (aEndDate < bStartDate || bStartDate > bEndDate) return true;
        if ((bStartDate - bStartDate)(1000 * 60) >= this.props.durations[this.props.selected].minutes) return true;
        if ((aEndDate - bEndDate)(1000 * 60) >= this.props.durations[this.props.selected].minutes) return true;
        return false;
    }

    canSchedule = (block) => {
        console.log((new Date(block.end) - new Date(block.start)) / (1000 * 60) >= this.props.durations[this.props.selected].minutes);
        return (new Date(block.end) - new Date(block.start)) / (1000 * 60) >= this.props.durations[this.props.selected].minutes;
    }

    // https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects#answer-34890276
    groupBy = (xs, key) => {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    updateRequiredInterviewers = (event) => {
        this.setState({ required: event.target.value });
    }

    updateOptionalInterviewers = (event) => {
        this.setState({ optional: event.target.value });
    }

    updateCandidate = (event) => {
        // console.log(event)
        this.setState({ candidate: event.target.value });
    }

    handlePopoverOpen = (event) => {
        // console.log('open popover')
        // console.log(event.target)
        this.setState(event.target);
    };

    handlePopoverClose = () => {
        // console.log('close popover')
        this.setState(null);
    };

    handleSelect(selected) {
        const { background, color } = this.state;

        for (let i = 0; i < 4; i++)
            if (i === selected) {
                background[i] = '#280e3a';
                color[i] = '#fff';
            }
            else {
                background[i] = '#fff';
                color[i] = '#280e3a';
            }

        this.setState({ background: background });
    }

    createOptions = () => {
        const { classes } = this.props;
        return (
            <List dense>
                {this.state.options.map(option => {
                    const hash = `${option.date}-${option.time.start}-${option.time.end}-${Math.random() * 1000}`;
                    const labelId = `radio-list-secondary-label-${hash}`;
                    return (
                        // TODO: Format date and time
                        <ListItem key={hash} button>
                            {/* <ListItemAvatar>
                                <Avatar
                                    alt={`Avatar n°${value + 1}`}
                                    src={`/static/images/avatar/${value + 1}.jpg`}
                                />
                            </ListItemAvatar> */}
                            <ListItemText
                                id={labelId}
                                primary={
                                    <Box>
                                        <Box fontWeight='fontWeightBold'><Moment format='ll'>{option.date}</Moment></Box>
                                        <Typography>Starts at <Moment format='h:mm a'>{option.time.start}</Moment></Typography>
                                        <Typography>Ends at <Moment format='h:mm a'>{option.time.end}</Moment></Typography>
                                    </Box>
                                }
                                secondary={option.room} />
                            <Box component='div' display='flex'>
                                {option.interviewers.map(
                                    function (interviewer) {
                                        console.log('interviewer: ' + JSON.stringify(interviewer))
                                        return (
                                            <Avatar
                                                key={`${interviewer}-${Math.random() * 1000}`}
                                                // onMouseEnter={this.handlePopoverOpen}
                                                // onMouseLeave={this.handlePopoverClose}
                                                className={classes.avatar}>{interviewer.split(' ')[1].charAt(0).toUpperCase()}</Avatar>
                                        )
                                    }, this
                                )}
                            </Box>
                            <ListItemSecondaryAction>
                                <GreenRadio
                                    checked={false}
                                    // onChange={handleChange}
                                    value="c"
                                    inputProps={{ 'aria-label': 'C' }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
        );
    }

    displayPopover = () => {
        const { classes } = this.props;
        return (
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={Boolean(this.state.popover)}
                anchorEl={this.state.popover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={this.handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>I use Popover.</Typography>
            </Popover>
        )
    }

    render() {
        // const { classes } = this.props;
        return (
            <Dialog open={true} aria-labelledby="form-options">
                <DialogTitle id="form-options">Select Interview Slot</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select an interview slot to schedule an interview.
                        Upon submission, emails will be sent out to the candidate and interviewers.
                    </DialogContentText>
                    {this.createOptions()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleOpen} color="primary">Back</Button>
                    <Button onClick={this.props.handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(OptionsDialog);
