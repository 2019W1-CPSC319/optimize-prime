import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import {
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';

const styles = theme => ({
  title: {
    fontWeight: 'normal',
    marginLeft: '30px',
  },
  flex: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  header: {
    justifyContent: 'space-between',
  },
  directory: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  delete: {
    color: '#ff454e',
    borderColor: '#ff454e',
    '&:hover': {
      backgroundColor:
        'rgba(255, 69, 78, 0.2)'
    }
  }
});

class DirectoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  render() {
    const { classes } = this.props;

    function handleChange(e, value) {
      this.setState({ value: value });
    }

    function createData(name, job, username, password) {
      return { name, job, username, password };
    }

    function Directory(props) {
      const { label, rows } = props
      return <Paper className={classes.directory}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{label} Name</TableCell>
              <TableCell>{label === 'Candidate' ? 'University Name' : 'Job Title'}</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.job}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell><Button variant="outlined" className={classes.delete}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>;
    }

    const candidates = [
      createData('Chris Evans', 'University of British Columbia', 'c.evans@gmail.com', '********'),
      createData('Robert Downey Jr.', 'Simon Fraser University', 'r.downey@gmail.com', '********'),
      createData('Scarlet Johansen', 'British Columbia Institue of Technology', 's.johansen@gmail.com', '********'),
      createData('Tom Holland', 'University of Waterloo', 't.holland@gmail.com', '********'),
      createData('Benedict Cumberbatch', 'University of Victoria', 'b.cumberbatch@gmail.com', '********'),
    ];

    const employees = [
      createData('Captain America', 'Senior Project Manager', 'c.america@galvanize.com', '********'),
      createData('Iron man', 'UX Designer', 'i.man@galvanize.com', '********'),
      createData('Black Widow', 'Junior Software Developer', 'b.widow@galvanize.com', '********'),
      createData('Spider man', 'Business Analyst', 's.man@galvanize.com', '********'),
      createData('Dr. Strange', 'Senior Project Owner', 'd.strange@galvanize.com', '********'),
    ];

    return <div>
      <div className={classes.header}>
        <h1 className={classes.title}>Directory</h1>
      </div>
      <Paper style={{ margin: '40px 10px auto' }} square>
        <Tabs
          value={this.state.value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange.bind(this)}
          aria-label="disabled tabs example"
        >
          <Tab label="Candidate" />
          <Tab label="Employee" />
        </Tabs>
        <div hidden={this.state.value !== 0}><Directory label="Candidate" rows={candidates} /></div>
        <div hidden={this.state.value !== 1}><Directory label="Employee" rows={employees} /></div>
      </Paper>
    </div>;
  }
}

export default withStyles(styles)(DirectoryPage);
