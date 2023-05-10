import React, { useRef } from "react";
import { Form, Button } from 'react-bootstrap';
import classes from './AddTask.module.css';
import axios from "axios";
import { useDispatch } from "react-redux";
import { addTasks } from "../../redux/actions/tasks";
import { useNavigate } from "react-router-dom";

const AddTask: React.FC = props => {
    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
    const dueDateInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const submitHandler = async (event: React.FormEvent) => {
      event.preventDefault();
      // do something with form data
    
      try {
        const token = localStorage.getItem('token');

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks`, {
            title: titleInputRef.current?.value,
            description: descriptionInputRef.current?.value,
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
            navigate('/all-tasks');
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
