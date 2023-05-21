import axios from 'axios';
import { showToast } from './toaser';

export const fetchTeamsRequest = () => {
  return {
    type: 'FETCH_TEAMS_REQUEST',
  };
};

export const fetchTeamsSuccess = (teams: any) => {
  return {
    type: 'FETCH_TEAMS_SUCCESS',
    payload: teams,
  };
};

export const fetchTeamsFailure = (error: any) => {
  return {
    type: 'FETCH_TEAMS_FAILURE',
    payload: error,
  };
};

export const fetchTeamsFromStore = (teams: any) => {
    return {
      type: 'FETCH_TEAMS_FROM_STORE',
      payload: teams,
    };
};

export const fetchTeams = (): any => {
    const token = localStorage.getItem('token');

    return async (dispatch: any) => {
        try {
            dispatch(fetchTeamsRequest());
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/teams`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }  
            });

            if (response.status === 200) {
                const teams = response.data.teams;
                dispatch(fetchTeamsSuccess(teams));
            }
        } catch (error: any) {
            const errorMessage = error.message;
            dispatch(fetchTeamsFailure(errorMessage));
        }
    };
};

// export const emptyTasks = () => {
//   return {
//     type: 'EMPTY_TASKS',
//     payload: [],
//   };
// };

export const addTeams = (team: any) => {
  return {
    type: 'ADD_TEAM',
    payload: team,
  };
};

export const deleteTeam = (teamId: any) => {
  return {
    type: 'DELETE_TEAM',
    payload: teamId
  };
};

export const askToLeaveTeam = (userId: any, teamId: any): any => {
  const token = localStorage.getItem('token');

  return async (dispatch: any) => {
      try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/teams/ask-to-leave?teamId=${teamId}&userId=${userId}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }  
          });

          if (response.status === 200) {
              dispatch(fetchTeams());
              dispatch(showToast('success', response.data.message));
          }
      } catch (error: any) {
          console.log(error.message);
      }
  };
};

export const askToLeaveSuccess = (teams: any) => {
  return {
    type: 'ASK_TO_LEAVE_SUCCESS',
    payload: teams,
  };
};