import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'raf/polyfill';

global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
configure({ adapter: new Adapter() });
