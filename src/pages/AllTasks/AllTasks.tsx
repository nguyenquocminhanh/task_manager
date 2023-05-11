import React, { useEffect, useState } from 'react';
import classes from './AllTasks.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, fetchTasks, updateTaskCompleted } from '../../redux/actions/tasks';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import AppModal from '../../ui/Modal';
import axios from 'axios';
import { truncate } from '../../utils/truncate';
import { showToast } from '../../redux/actions/toaser';
import { convertTime } from '../../utils/converTime';

export interface Task {
    id: string,
    title: string,
    description: string,
    dueDate: string,
    completed: boolean,
}

export interface RootState {
    tasks: {
        tasks: Task[]
    },
    toaster: {
        toastMessage: string,
        toastType: string
    }
}

const AllTasks: React.FC = props => {
    // redux store
    const tasks = useSelector((state: RootState)=> state.tasks.tasks);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [isModalShow, setIsModalShow] = useState<boolean>(false);
    const [action, setAction] = useState<string>("Delete");
    const [taskName, setTaskName] = useState<string>("");
    const [taskId, setTaskId] = useState<string | null>(null);
    const [taskComplete, setTaskComplete] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchTasks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setAllTasks(tasks ? tasks : [])
    }, [tasks])

    const onDeleteHandler = (event: React.FormEvent, taskName: string, taskId: string, taskComplete: boolean) => {
        event.stopPropagation();

        setAction("Delete");
        setIsModalShow(true);
        setTaskId(taskId);

        setTaskName(taskName);
        setTaskComplete(taskComplete);
    }

    const onCheckHandler = (event: React.FormEvent, taskName: string, taskId: string, taskComplete: boolean) => {
        event.stopPropagation();

        if (taskComplete) {
            setAction("Mark As Incompleted");
        }
        else {
            setAction("Mark As Completed");
        }
        setIsModalShow(true);
        setTaskId(taskId);
        setTaskName(taskName);
        setTaskComplete(taskComplete);
    }

    const onConfirmHandler = async () => {
        const token = localStorage.getItem('token');
        if (action === 'Delete') {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }  
                });
        
                if (response.status === 200) {    // delete success
                    setIsModalShow(false);
                    dispatch(deleteTask(taskId));
                    console.log(response.data.message);
                    dispatch(showToast('success', response.data.message))
                }
            } catch (error: any) {
                console.log(error);
                dispatch(showToast('error', error.response.data));
            }
        } else {        // PUT
            try {
                // console.log(taskComplete);
                const response = await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, 
                    {
                        // empty body
                    }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }  
                });
        
                if (response.status === 200) {    // UPDATE success
                    setIsModalShow(false);
                    dispatch(updateTaskCompleted(taskId, taskComplete));
                    dispatch(showToast('success', response.data.message));
                }
            } catch (error: any) {
                console.log(error);
                dispatch(showToast('error', error.response.data));
            }
        }
    }

    return (
        <div className={classes.taskList}>
            {allTasks.map(task => (
                <div style={{background: task.completed ? '#CFF1C5' : ( task.dueDate < new Date().toISOString().split('T')[0] ? '#FFB5D1' : '#D7E6FA' )}} className={classes.task} key={task.id} onClick={() => navigate(`/task/${task.id}`)}>
                    <h4>{task.title}</h4>

                    <div className={classes.CheckTrash}>
                        <Button onClick={(e) => onCheckHandler(e, task.title, task.id, task.completed)} variant="outline-dark" size="sm" >
                            {task.completed ? <FaTimes/> : <FaCheck />}
                        </Button> 
                        &nbsp;&nbsp;
                        <Button onClick={(e) => onDeleteHandler(e, task.title, task.id, task.completed)} variant="outline-dark" size="sm" >
                            <FaTrash />
                        </Button>
                    </div>

                    <p>{truncate(task.description)}</p>
                    <div className={classes.details}>
                        <div>
                            <span>Due Date:</span> {convertTime(task.dueDate)}
                        </div>
                        <div>
                            {/* <span>Status: </span> */}
                            <span>{task.completed ? 'Completed' : (task.dueDate < new Date().toISOString().split('T')[0] ? 'Overdue' : 'Incomplete')}</span>
                        </div>
                    </div>
                </div>
            ))}

            <AppModal 
                isModalShow={isModalShow}
                action={action}
                taskName={taskName}
                onHandleClose={() => setIsModalShow(false)}
                onConfirm={onConfirmHandler}/>
        </div>
    );
};

export default AllTasks;




