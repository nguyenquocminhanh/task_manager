import React, { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../pages/AllTasks/AllTasks';
import { emptyTasks } from '../redux/actions/tasks';
import { showToast } from '../redux/actions/toaser';

const NavigationBar: React.FC = props => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tasks = useSelector((state: RootState)=> state.tasks.tasks);

  const handleLogout = () => {
    // remove token from local storage and set authentication status to false
    localStorage.removeItem('token');
    setToken(null);
    navigate('/auth');
    // empty redux tasks
    dispatch(emptyTasks());
    dispatch(showToast('info', 'Logged out!'))
  }

  return (
    <Navbar bg="dark" expand="lg" variant='dark'>
      <Container>
        <Navbar.Brand as={Link} to="/">Task Manager</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

          {token ? 
            <Nav.Link as={Link} to="/all-tasks" active={window.location.pathname.includes('all-task') ? true : false}>All Tasks{`(${tasks.length})`}</Nav.Link>
          : 
            null
          }

          {token ? 
            <Nav.Link as={Link} to="/add-task" active={window.location.pathname.includes('add-task') ? true : false}>Add Task</Nav.Link>
          : 
            null
          }

          {token ? 
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          : 
            <Nav.Link as={Link} to="/auth" active={window.location.pathname.includes('auth') ? true : false}>Login</Nav.Link>
          }
        </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar;