import axios from 'axios';
import { showToast } from './toaser';

export const fetchTasksRequest = () => {
  return {
    type: 'FETCH_TASKS_REQUEST',
  };
};

export const fetchTasksSuccess = (tasks: any) => {
  return {
    type: 'FETCH_TASKS_SUCCESS',
    payload: tasks,
  };
};

export const fetchTasksFailure = (error: any) => {
  return {
    type: 'FETCH_TASKS_FAILURE',
    payload: error,
  };
};

export const fetchTasksFromStore = (tasks: any) => {
    return {
      type: 'FETCH_TASKS_FROM_STORE',
      payload: tasks,
    };
};

export const fetchTasks = (): any => {
    const token = localStorage.getItem('token');

    return async (dispatch: any, getState: any) => {
        const { tasks } = getState();
        // tasks already fetch from server, stored in redux store
        if (tasks.isLoaded) {
            const sortedTasks = tasks.tasks.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
            dispatch(fetchTasksFromStore(sortedTasks));
        } else {    // fetch from server, when refresh page or first time access all-tasks page
            try {
                dispatch(fetchTasksRequest());
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }  
                });

                if (response.status === 200) {
                    const tasks = response.data.tasks.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                    dispatch(fetchTasksSuccess(tasks));
                }
            } catch (error: any) {
                const errorMessage = error.message;
                dispatch(fetchTasksFailure(errorMessage));
            }
        }
    };
};

export const emptyTasks = () => {
  return {
    type: 'EMPTY_TASKS',
    payload: [],
  };
};

export const addTasks = (task: any) => {
  return {
    type: 'ADD_TASK',
    payload: task,
  };
};

export const fetchTaskDetail = (taskId: any): any => async (dispatch: any, getState: any) => {
  const token = localStorage.getItem('token');

  const { tasks } = getState();
  const task = tasks.tasks.find((task: any) => task.id === taskId);
  if (task) { // there exists task in redux store
    dispatch({
      type: 'FETCH_TASK_DETAIL_FROM_STORE',
      payload: task
    })
  } else {  // fetch data from server
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }  
      });

      if (response.status === 200) {
          const task = response.data.task;
          dispatch({
            type: 'FETCH_TASK_DETAIL_FROM_SERVER',
            payload: task
          });
      } 
    } catch (error: any) {
      const errorMessage = error.response.data;
      dispatch(showToast('error', errorMessage));
      dispatch({
        type: 'FETCH_TASK_DETAIL_DROM_SERVER_FAILURE',
        payload: errorMessage
      });
    }
  }
};


export const emptyTask = () => {
  return {
    type: 'EMPTY_TASK',
    payload: null
  };
};

export const deleteTask = (taskId: any) => {
  return {
    type: 'DELETE_TASK',
    payload: taskId
  };
};

export const updateTaskCompleted = (id: any, completed: boolean) => {
  return {
    type: 'UPDATE_TASK_COMPLETE',
    payload: { id, completed }
  }
}

export const updateTaskInfo = (id: any, title: any, description: any, dueDate: any) => {
  return {
    type: 'UPDATE_TASK_INFO',
    payload: { id, title, description, dueDate }
  }
}
