import React, { useEffect, useRef, useState } from "react";
import { Form, Button } from 'react-bootstrap';
import classes from './TaskDetail.module.css';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskInfo, fetchTaskDetail } from "../../redux/actions/tasks";
import { useNavigate, useParams } from "react-router-dom";
import { Task } from "../AllTasks/AllTasks";
import { showToast } from "../../redux/actions/toaser";

export interface RootState {
    tasks: {
        task: Task
    };
}

const TaskDetail: React.FC = props => {
    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
    const dueDateInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { taskId } = useParams();

    const task = useSelector((state: RootState) => state.tasks.task);

    // initialize the form state with the latest task data
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        dueDate: ''
    });
    

    useEffect(() => {
        dispatch(fetchTaskDetail(taskId));
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // update the form state when the task is updated in the store
        setFormState({
            title: task? task.title : '',
            description: task? task.description : '',
            dueDate: task? task.dueDate: ''
        });
    }, [task]);
  
    const submitHandler = async (event: React.FormEvent) => {
      event.preventDefault();
      // do something with form data
    
      try {
        const token = localStorage.getItem('token');

        const response = await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
            title: titleInputRef.current?.value,
            description: descriptionInputRef.current?.value,
            dueDate: dueDateInputRef.current?.value,   
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }  
        });

        if (response.status === 200) {
            // update task to redux store
            dispatch(updateTaskInfo(taskId, titleInputRef.current?.value, descriptionInputRef.current?.value, dueDateInputRef.current?.value));
            dispatch(showToast('success', response.data.message));
            navigate('/all-tasks');
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
        <div className={classes.AddTaskContainer}>
            <Form onSubmit={submitHandler} className={classes.Form}>
                <h2>Edit task</h2>
                <Form.Group controlId="formBasicTitle" className="mb-3">
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control required type="text" ref={titleInputRef} defaultValue={formState.title}/>
                </Form.Group>

              
                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Task Description</Form.Label>
                    <Form.Control required as="textarea" rows={4} ref={descriptionInputRef} defaultValue={formState.description}/>
                </Form.Group>
           

                <Form.Group controlId="formBasicDueDate" className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control required type="date" min={new Date().toISOString().split('T')[0]} ref={dueDateInputRef} defaultValue={formState.dueDate}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Update
                </Button>
            </Form>
        </div>
    );
}

export default TaskDetail;
