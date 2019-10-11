const initialState = {
  currentPage: 'home',
};

const NavReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NAVIGATE_PAGE':
      return Object.assign({}, state, { currentPage: action.page });
    default:
      return state;
  }
};

export default NavReducer;
