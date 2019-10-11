import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import RootReducer from './reducers';
import customMuiStyles from './css/customMuiStyles';

const theme = createMuiTheme(customMuiStyles);

ReactDOM.render(
  <Provider store={createStore(RootReducer, applyMiddleware(thunk))}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
