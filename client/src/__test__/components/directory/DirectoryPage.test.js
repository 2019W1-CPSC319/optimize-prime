import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DirectoryPage from '../../../components/directory/DirectoryPage';

describe('Directory Page - Render', () => {
  let wrapper;
  const classes = {};
  const actions = {};

  beforeEach(() => {
    wrapper = shallow(<DirectoryPage
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
