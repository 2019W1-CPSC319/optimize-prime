import React, { Component } from 'react';
import Moment from 'react-moment';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {
    Avatar,
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
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
        };
    }

    updateRequiredInterviewers = (event) => {
        this.setState({ required: event.target.value });
    }

    updateOptionalInterviewers = (event) => {
        this.setState({ optional: event.target.value });
    }

    updateCandidate = (event) => {
        this.setState({ candidate: event.target.value });
    }

    handlePopoverOpen = (event) => {
        this.setState(event.target);
    };

    handlePopoverClose = () => {
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

        console.log(this.props);
        if (Array.isArray(this.props.meetingSuggestions.data) && this.props.meetingSuggestions.data.length > 0) {
            return (
                <List dense>
                    {this.props.meetingSuggestions.data.map(option => {
                        const hash = `${option.date}-${option.time.start}-${option.time.end}-${option.room}`;
                        const labelId = `radio-list-secondary-label-${hash}`;
                        return (
                            <ListItem key={hash}>
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
                                        checked={this.props.selectedOption === hash}
                                        onChange={() => this.props.handleSelectOption(hash)}
                                        value={hash}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            );
        } else {
            return (
                <Box style={{ padding: '50px' }}>
                    <Typography style={{ textAlign: 'center' }}>
                        {Array.isArray(this.props.meetingSuggestions.data) ? 'No options available' : this.props.meetingSuggestions.data}
                    </Typography>
                    <Button
                        color='primary'
                        style={{ display: 'block', margin: 'auto' }}
                        onClick={this.props.handleOpen}
                    >Go back</Button>
                </Box>
            );
        }

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
            <Dialog open={this.props.optOpen} aria-labelledby="form-options">
                <DialogTitle id="form-options">Select Interview Slot</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select an interview slot to schedule an interview.
                        Upon submission, emails will be sent out to the candidate and interviewers.
                    </DialogContentText>
                    {this.props.meetingSuggestions && this.createOptions()}
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
