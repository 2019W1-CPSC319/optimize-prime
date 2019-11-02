export const getState = (globalState) => globalState.interviewers || {};
export const getInterviewers = (state) => getState(state).interviewers || [];
