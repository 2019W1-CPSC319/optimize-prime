import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import RoomPage from '../../../components/room/RoomPage';

describe('Room Page - Render', () => {
  let wrapper;
  const classes = {};
  const actions = {
    getRooms: jest.fn(),
    getOutlookRooms: jest.fn(),
  };

  beforeEach(() => {
    wrapper = shallow(<RoomPage
      classes={classes}
      actions={actions}
      rooms={[]}
    />);
  });

  it('render the component', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
