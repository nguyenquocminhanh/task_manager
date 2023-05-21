import React, { useContext, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import NavigationBar from './ui/NavigationBar';
import Auth from './pages/Auth/Auth';
import AddTask from './pages/AddTask/AddTask';
import WithAuth from './HOC/WithAuth';
import AllTasks, { RootState } from './pages/AllTasks/AllTasks';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from './redux/actions/tasks';
import TaskDetail from './pages/TaskDetail/TaskDetail';
import Toaster from './ui/Toaster';
import AllTeams from './pages/AllTeams/AllTeams';
import TeamTasks from './pages/TeamTasks/TeamTasks';
import WithMembership from './HOC/WithMembership';
import { AuthContext } from './contexts/AuthContext';

const App: React.FC = props => {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state: RootState)=> state.tasks.error);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTasks());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // logout when token is not valid
    if (errorMessage === "Request failed with status code 403" && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      setToken(null);
      navigate('/auth');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage])

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

        <Route 
          path='/all-teams' 
          element={<WithAuth>
            <AllTeams/>
          </WithAuth>}/>

        <Route 
          path='/all-teams/team/:teamId' 
          element={<WithAuth>
            <WithMembership>
              <TeamTasks/>
            </WithMembership>
          </WithAuth>}/>
      </Routes>

      <Toaster/>
    </>
  );
}

export default App;
