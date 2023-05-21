import React, { useEffect, useRef, useState } from "react";
import classes from './TeamTasks.module.css';
import { useNavigate, useParams } from "react-router-dom";
import { Task } from "../AllTasks/AllTasks";
import { Button, OverlayTrigger, Popover, ToastContainer } from "react-bootstrap";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { truncate } from "../../utils/truncate";
import { formatDate, formatDateTime } from "../../utils/formateDate";
import axios from "axios";
import AppModal from "../../ui/Modal";
import { toast } from "react-toastify";
import { deleteTask, updateTaskCompleted } from "../../redux/actions/tasks";
import { useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import { showToast } from "../../redux/actions/toaser";
import jwtDecode from "jwt-decode";

export interface User {
    id: number,
    email: string,
    password: string,
    name: string
}

interface Message {
    id: number,
    content: string,
    user_id: string,
    sender: {
        name: string
    },
    createdAt: string,
    team_id: string
}

interface ActiveMember {
    socketId: string,
    userId: string
}

const TeamTasks: React.FC = props => {
    const { teamId } = useParams();
    const [teamName, setTeamName] = useState<string>('');
    const [ownerId, setOwnerId] = useState<number | null>(null);
    const navigate = useNavigate();
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [allMembers, setAllMembers] = useState<User[]>([]);
    const [isModalShow, setIsModalShow] = useState<boolean>(false);
    const [action, setAction] = useState<string>("Delete");
    const [taskName, setTaskName] = useState<string>("");
    const [taskId, setTaskId] = useState<string | null>(null);
    const [taskComplete, setTaskComplete] = useState<boolean>(false);
    const dispatch = useDispatch();
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const [activeMembers, setActiveMembers] = useState<ActiveMember[]>([]);
    const messageRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // scroll to bottom
        // lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (chatMessagesRef && chatMessagesRef.current) {
            // Scroll to bottom
            chatMessagesRef.current.scrollTo({
              top: chatMessagesRef.current.scrollHeight,
              behavior: "smooth",
            });
        }

        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: {userId: number, exp: number} = jwtDecode(token);
            const tokenExpiration = decodedToken.exp;
            const expiresIn = new Date(tokenExpiration).getTime()*1000 - new Date().getTime();
            if (expiresIn > 0) {
                const user_id = decodedToken.userId;
                setUserId(user_id.toString());   
            } 
        }

        const socket = io(`https://task-manager-server-minh-nguyen.vercel.app`, {
            auth: { token: localStorage.getItem('token')},
        });

        setSocket(socket);

        socket.on('connect', () => {
            console.log('Socket connected');

            socket.emit('joinTeamRoom', { teamId: teamId });
            
            // get all users
            // get all tasks
            socket.on('getData', ({ allTasks, teamName, allUsers, owner_id, allMessages }) => {
                setTeamName(teamName);
                setAllTasks(allTasks);
                setAllMembers(allUsers);
                setOwnerId(owner_id);
                setMessages(allMessages);
            });

            // create task
            socket.on('taskCreated', allTasks => {
                setAllTasks(allTasks);
            });

            // delete task
            socket.on('taskDeleted', allTasks => {
                setAllTasks(allTasks);
            });

            // update task completed
            socket.on('taskCompletedUpdated', allTasks => {
                setAllTasks(allTasks);
            });

            // update task info
            socket.on('taskInfoUpdated', allTasks => {
                setAllTasks(allTasks);
            });

            // getout
            socket.on('getout', () => {
                dispatch(showToast('info', 'Task Not Found'));
                navigate('/all-teams');
            })

            // receive message
            socket.on('messageResponse', (messageData: Message) => {
                setMessages((prevMessages: Message[]) => [...prevMessages, messageData]);
            });
            
            // Listen for the 'onlineUsers' event from the server
            socket.on('onlineUsers', (updatedOnlineUsers) => {
                setActiveMembers(updatedOnlineUsers);
            });

            // messages after delete
            socket.on('messages after delete', (messageData: Message[]) => {
                setMessages(messageData);
            })
        });

        return () => {
            socket.disconnect();
            console.log('socket disconnect')
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamId]);

    // scroll to message when messages changes
    useEffect(() => {
        if (chatMessagesRef && chatMessagesRef.current) {
            // Scroll to bottom
            chatMessagesRef.current.scrollTo({
              top: chatMessagesRef.current.scrollHeight,
              behavior: "smooth",
            });
        }   
    }, [messages]);
    

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

    const onDeleteHandler = (event: React.FormEvent, taskName: string, taskId: string, taskComplete: boolean) => {
        event.stopPropagation();

        setAction("Delete");
        setIsModalShow(true);
        setTaskId(taskId);

        setTaskName(taskName);
        setTaskComplete(taskComplete);
    };

    const onConfirmHandler = async () => {
        const token = localStorage.getItem('token');
        if (action === 'Delete') {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_API_URL}/tasks/${taskId}`, 
                    { 
                        data: { teamId },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }  
                    }
                );
        
                if (response.status === 200) {    // delete success
                    setIsModalShow(false);
                    dispatch(deleteTask(taskId));
                    toast.success(response.data.message);
                }
            } catch (error: any) {
                console.log(error);
                toast.error(error.response.data);
            }
        } else {        // PUT
            try {
                // console.log(taskComplete);
                const response = await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, 
                    {
                        teamId: teamId
                    }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }  
                });
        
                if (response.status === 200) {    // UPDATE success
                    setIsModalShow(false);
                    dispatch(updateTaskCompleted(taskId, taskComplete));
                    toast.success(response.data.message);
                }
            } catch (error: any) {
                console.log(error);
                toast.error(error.response.data);
            }
        }
    }

    const popover = (
        <Popover id="member-list-popover">
          <Popover.Header as="h3">Team Members</Popover.Header>
          <Popover.Body>
            <div style={{ padding: 0, margin: "0 10px" }}>
              {allMembers.map((member) => (
                <div key={member.id} className={classes.activeMemberItem}>
                    <div className={[classes.statusIndicator, activeMembers.some(active => active.userId === member.id.toString()) ? classes.active : classes.inactive].join(' ')}></div>
                    <span key={member.id}>{member.name} {ownerId === member.id ? '(Team Leader)' : null}</span>
              </div>
              ))}
            </div>
          </Popover.Body>
        </Popover>
    );
    

    const handleSendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        // console.log({ userName: localStorage.getItem('userName'), message });
        const message = messageRef.current?.value;
        if (socket && message!.trim()) {
            // Use the existing socket connection
            socket.emit('message', {
                content: message,
                user_id: userId,
                team_id: teamId
            });
        }
        messageRef.current!.value = '';
    };

    const deleteMessageHandler = (messageId: number) => {
        if (socket) {
            socket.emit('delete message', messageId);
        }
    }

    const handleTyping = () => {
        if (socket) {
            socket.emit('typing');
        }
    }


    return (
        <>
            <div className={classes.Content}>    
                <div className={classes.taskList}>
                    <div className={classes.taskCol}> 
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
                                    <span>Creator:</span> {task.creator.name}
                                </div>
                            </div>
                            <div className={classes.details}>
                                <div>
                                    <span>Due Date:</span> {formatDate(task.dueDate)}
                                </div>
                                <div>
                                    {/* <span>Status: </span> */}
                                    <span>{task.completed ? 'Completed' : (task.dueDate < new Date().toISOString().split('T')[0] ? 'Overdue' : 'Incomplete')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>  
              
                </div>

                <div className={classes.ChatComponent}>
                    {/* Chat title */}
                    <div className={classes.chatTitleBar}>
                        <h2 className={classes.chatTitle}>{teamName}</h2> 
                        <div className={classes.TeamMembers}>
                            <OverlayTrigger
                                placement="bottom"
                                // delay={{ show: 250, hide: 400 }}
                                overlay={popover}
                                rootClose={false}
                            >
                                <span style={{ cursor: 'pointer' }}>
                                    <BsPeopleFill size={20} />
                                </span>
                            </OverlayTrigger>        
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className={classes.chatMessages} ref={chatMessagesRef}>
                        {messages.map((message : Message, i: number) => (
                            <div className={`${classes.messageContent} ${message.user_id === userId ? classes.send : classes.receive}`} key={message.id}>
                                <span className={classes.sender} style={{color: message.user_id === userId? 'blue' : '#212529'}}>{message.sender.name}</span>
                                <span className={classes.messageTime}>{formatDateTime(message.createdAt)}</span>
                                <p className={classes.message}>{message.content}</p>

                                { message.user_id === userId ?
                                <div className={classes.CheckTrashMessage}>
                                    <Button variant="outline-dark" size="sm" onClick={() => deleteMessageHandler(message.id)}>
                                        <FaTrash />
                                    </Button>
                                </div> : null }
                            </div>
                        ))}

                        {/* <div ref={lastMessageRef} /> */}
                    </div>

                    {/* Chat input */}
                    <div className={classes.chatInput}>
                        <form onSubmit={handleSendMessage}>
                            <input type="text" onKeyDown={handleTyping} placeholder="Type your message" ref={messageRef}/>
                            <button>Send</button>
                        </form>
                    </div>
                </div>
            </div>

            <AppModal 
                isModalShow={isModalShow}
                action={action}
                taskName={taskName}
                onHandleClose={() => setIsModalShow(false)}
                onConfirm={onConfirmHandler}/>

            <ToastContainer />
        </>
    )
}

export default TeamTasks;