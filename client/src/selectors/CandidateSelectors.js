export const getState = (globalState) => globalState.candidates || {};
export const getCandidates = (state) => getState(state).candidates || [];
export const getCandidateById = (state, id) => (
  getCandidates(state).find((candidate) => candidate.id.toString() === id) || null
);
