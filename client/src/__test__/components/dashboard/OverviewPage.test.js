import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import OverviewPage from '../../../components/dashboard/OverviewPage';

describe('Overview Page - Render', () => {
  let wrapper;
  const classes = {};
  const actions = {};

  beforeEach(() => {
    wrapper = shallow(<OverviewPage
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
