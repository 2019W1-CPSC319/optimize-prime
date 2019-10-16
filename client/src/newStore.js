import { applyMiddleware, compose as reduxCompose, createStore } from "redux"
import thunk from "redux-thunk"
import RootReducer from "./reducers"

// Add redux devtools to our application if available
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose

/**
 * This function creates a new store instance ready for use with Redux DevTools
 * @param {object} [initialState} The initial state of the store
 * @returns A new store object that supports the Redux DevTools extension
 */

export const newStore = () => {
	const initialStateElement = document.getElementById("initialState")
	let initState = {}
	if(initialStateElement) {
		initState = JSON.parse(initialStateElement.innerHTML || "{}")
	}
	return createStore(RootReducer(), initState, compose(
		applyMiddleware(thunk)
	))
}