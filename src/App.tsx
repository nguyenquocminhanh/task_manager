import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import NavigationBar from './ui/NavigationBar';
import Auth from './pages/Auth/Auth';
import AddTask from './pages/AddTask/AddTask';
import WithAuth from './HOC/WithAuth';
import AllTasks from './pages/AllTasks/AllTasks';
import { useDispatch } from 'react-redux';
import { fetchTasks } from './redux/actions/tasks';
import TaskDetail from './pages/TaskDetail/TaskDetail';

const App: React.FC = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavigationBar/>

      <Routes>
        <Route 
          path='/'
          element={<Navigate to="/all-tasks" replace/>}/>

        <Route 
          path='/auth'
          element={<Auth/>}/>
    
        <Route 
          path='/add-task' 
          element={<WithAuth>
            <AddTask/>
          </WithAuth>}/>

        <Route 
          path='/all-tasks' 
          element={<WithAuth>
            <AllTasks/>
          </WithAuth>}/>

        <Route 
        path='/task/:taskId' 
        element={<WithAuth>
          <TaskDetail/>
        </WithAuth>}/>
      </Routes>
    </>
  );
}

export default App;
