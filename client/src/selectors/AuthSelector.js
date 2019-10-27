export const getState = (globalState) => globalState.user;
export const getUserProfile = (state) => getState(state).profile || null;
export const isLoading = (state) => !!getState(state).loading;
export const hasTriedLogin = (state) => !!getState(state).hasTriedLogin;
