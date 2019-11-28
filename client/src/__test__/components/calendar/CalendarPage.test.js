import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CalendarPage from '../../../components/calendar/CalendarPage';

describe('Calendar Page - Render', () => {
  let wrapper;
  const classes = {};
  const actions = {};

  beforeEach(() => {
    wrapper = shallow(<CalendarPage
      classes={classes}
      actions={actions}
    />);
  });

  it('render the component', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
