const initialState = {
    teams: [],
    isLoaded: false,        // marked as not yet fetch from server - true fetched - then just need to fetch from store
    error: null,
  };
  
const teamsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_TEAMS_REQUEST':
        return {
          ...state,
          isLoaded: false
        };
      case 'FETCH_TEAMS_SUCCESS':
        return {
          ...state,
          teams: action.payload,
          isLoaded: true,
        };
      case 'FETCH_TEAMS_FAILURE':
        return {
          ...state,
          isLoaded: false,
          error: action.payload,
        };
      case 'FETCH_TEAMS_FROM_STORE':
        return {
            ...state,
            teams: action.payload,
        };
      // case 'EMPTY_TASKS':
      //   return {
      //       ...state,
      //       tasks: action.payload,
      //       isLoaded: false
      //   };
      case 'ADD_TEAM':
        return {
            ...state,
            teams: [...state.teams, action.payload],
        };
      case 'DELETE_TEAM':
        const updatedTeams = state.teams.filter(team => team.id !== action.payload);
        return {
            ...state,
            teams: updatedTeams
        };
      default:
        return state;
    }
};
  
export default teamsReducer;
  