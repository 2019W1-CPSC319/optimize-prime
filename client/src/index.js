import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose as reduxCompose } from 'redux';
import thunk from 'redux-thunk';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import RootReducer from './reducers';
import customMuiStyles from './css/customMuiStyles';

// Add redux devtools to our application if available
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose

const theme = createMuiTheme(customMuiStyles);

const getInitState = () => {
  const initialStateElement = document.getElementById('initState');
	let initState = {};
	if (initialStateElement) {
		initState = JSON.parse(initialStateElement.innerHTML || '{}');
  }
  return initState;
};

const store = createStore(RootReducer, getInitState(), compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
