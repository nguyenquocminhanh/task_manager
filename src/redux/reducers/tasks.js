const initialState = {
    tasks: [],
    isLoaded: false,        // marked as not yet fetch from server - true fetched - then just need to fetch from store
    error: null,
    task: null
  };
  
const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_TASKS_REQUEST':
        return {
          ...state,
          isLoaded: false
        };
      case 'FETCH_TASKS_SUCCESS':
        return {
          ...state,
          tasks: action.payload,
          isLoaded: true,
        };
      case 'FETCH_TASKS_FAILURE':
        return {
          ...state,
          isLoaded: false,
          error: action.payload,
        };
      case 'FETCH_TASKS_FROM_STORE':
        return {
            ...state,
            tasks: action.payload,
        };
      case 'EMPTY_TASKS':
        return {
            ...state,
            tasks: action.payload,
            isLoaded: false
        };
      case 'ADD_TASK':
        return {
            ...state,
            tasks: [...state.tasks, action.payload],
        };
      case 'FETCH_TASK_DETAIL_FROM_STORE':
        return {
            ...state,
            task: action.payload
        };
      case 'FETCH_TASK_DETAIL_FROM_SERVER':
        return {
            ...state,
            task: action.payload
      };
      case 'FETCH_TASK_DETAIL_DROM_SERVER_FAILURE':
        return {
          ...state,
          error: action.payload,
        };
      case 'EMPTY_TASK':
        return {
            ...state,
            task: action.payload
        };
      case 'DELETE_TASK':
        const updatedTasks = state.tasks.filter(task => task.id !== action.payload);
        return {
            ...state,
            tasks: updatedTasks
        };
        case 'UPDATE_TASK_COMPLETE':
          return {
            ...state,
            tasks: state.tasks.map(task => {
              if (task.id === action.payload.id) {
                return {
                  ...task,
                  completed: !action.payload.completed
                }
              } else {
                return task
              }
            })
          }
        case 'UPDATE_TASK_INFO':
          return {
            ...state,
            tasks: state.tasks.map(task => {
              if (task.id === action.payload.id) {
                return {
                  ...task,
                  title: action.payload.title,
                  description: action.payload.description,
                  dueDate: action.payload.dueDate
                }
              } else {
                return task
              }
            })
          }
      default:
        return state;
    }
};
  
export default tasksReducer;
  