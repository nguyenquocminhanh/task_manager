import React, { useEffect, useRef, useState } from "react";
import { Form, Button } from 'react-bootstrap';
import classes from './AddTask.module.css';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addTasks } from "../../redux/actions/tasks";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../redux/actions/toaser";
import { Team } from "../AllTeams/AllTeams";
import { fetchTeams } from "../../redux/actions/teams";
import { RootState } from "../AllTasks/AllTasks";

const AddTask: React.FC = props => {
    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
    const teamIdInputRef = useRef<HTMLSelectElement>(null);
    const dueDateInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const dispatch = useDispatch();
    const teams = useSelector((state: RootState)=> state.teams.teams);

    useEffect(() => {
        dispatch(fetchTeams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // update state, when redux storage change
        setAllTeams(teams ? teams : [])
    }, [teams])
  
    const submitHandler = async (event: React.FormEvent) => {
      event.preventDefault();
      // do something with form data
    
      try {
        const token = localStorage.getItem('token');

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks`, {
            title: titleInputRef.current?.value,
            description: descriptionInputRef.current?.value,
            team_id: teamIdInputRef.current?.value === 'Personal' ? null : teamIdInputRef.current?.value,
            dueDate: dueDateInputRef.current?.value,   
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }  
        });

        if (response.status === 201) {
            const task = response.data.task;
            // add task to redux store
            dispatch(addTasks(task));
            dispatch(showToast('success', response.data.message))
            if (teamIdInputRef.current?.value === 'Personal') {
                navigate('/all-tasks');
            } else {
                navigate(`/all-teams/team/${teamIdInputRef.current?.value}`);
            }
            
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
        <div className={classes.AddTaskContainer}>
            <Form onSubmit={submitHandler} className={classes.Form}>
                <h2>Add a new task</h2>
                <Form.Group controlId="formBasicTitle" className="mb-3">
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control required type="text" ref={titleInputRef}/>
                </Form.Group>

              
                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Task Description</Form.Label>
                    <Form.Control required as="textarea" rows={4} ref={descriptionInputRef}/>
                </Form.Group>
           
                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Task For</Form.Label>
                    <Form.Select defaultValue="Personal" ref={teamIdInputRef}>
                        <option value="Personal">Personal</option>
                        {allTeams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formBasicDueDate" className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control required type="date" min={new Date().toISOString().split('T')[0]} ref={dueDateInputRef}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Add
                </Button>
            </Form>
        </div>
    );
}

export default AddTask;
