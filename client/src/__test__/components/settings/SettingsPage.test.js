import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SettingsPage from '../../../components/settings/SettingsPage';

describe('Settings Page - Render', () => {
  let wrapper;
  const classes = {};
  const actions = {
    getEmailTemplate: jest.fn(),
  };
  const template = {
    subject: 'Interview with Galvanize',
    body: 'Please provide your availability.',
    signature: 'Galvanize HR Staff',
  };

  beforeEach(() => {
    wrapper = shallow(<SettingsPage
      classes={classes}
      actions={actions}
      template={template}
    />);
  });

  it('render the component', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
