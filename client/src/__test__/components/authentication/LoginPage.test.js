import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import LoginPage from '../../../components/authentication/LoginPage';

describe('Login Page - Render', () => {
  let wrapper;
  const classes = {};
  const actions = {};

  beforeEach(() => {
    wrapper = shallow(<LoginPage
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
