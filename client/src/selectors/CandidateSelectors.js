export const getState = (globalState) => globalState.candidates || {};
export const getCandidates = (state) => getState(state).candidates || [];
export const getCandidateById = (state, uuid) => (
  getCandidates(state).find((candidate) => candidate.uuid.toString() === uuid) || null
);
