import React, { useContext, useEffect, useRef, useState } from "react";
import classes from './AllTeams.module.css';
import { MdAdd, MdInput } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { Button, Form, InputGroup, Modal, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addTeams, deleteTeam, fetchTeams } from "../../redux/actions/teams";
import { RootState } from "../AllTasks/AllTasks";
import { AuthContext } from "../../contexts/AuthContext";
import jwtDecode from "jwt-decode";
import { FaTrash } from "react-icons/fa";

export interface Team {
    id: number,
    name: string,
    password: string,
    owner_id: number,
    owner: {
        name: string
    }
}

const AllTeams: React.FC = props => {
    const navigate = useNavigate();
    const [isModalShow, setModalShow] = useState<boolean>(false);
    const [isCreateTeamModal, setIsCreateTeamModal] = useState<boolean>(false);
    const teamNameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const passwordConfirmInputRef = useRef<HTMLInputElement>(null);
    const teams = useSelector((state: RootState)=> state.teams.teams);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const [ userId, setUserId ] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchTeams());
        if (token) {
            const decodedToken: {userId: number} = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // update state, when redux storage change
        setAllTeams(teams ? teams : [])
    }, [teams])

    const hideModalHandler = () => {
        setModalShow(false);
    }

    const openCreateTeamHandler = () => {
        setIsCreateTeamModal(true);
        setModalShow(true);
    }

    const openJoinTeamHandler = () => {
        setIsCreateTeamModal(false);
        setModalShow(true);
    }

    const modalSubmitHanlder = async () => {
        const teamNameInput = teamNameInputRef.current?.value;
        const passwordInput = passwordInputRef.current?.value;
        const passwordConfirmInput = passwordConfirmInputRef.current?.value;

        if (isCreateTeamModal) {
            if (passwordInput !== passwordConfirmInput) {
                toast.error('Password does not match');
                return
            }

            try {
                const token = localStorage.getItem('token');

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/teams`, {
                    teamName: teamNameInput,
                    password: passwordInput
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }  
                });
        
                if (response.status === 201) {      
                    dispatch(addTeams(response.data.team));
                    toast.success(response.data.message);
                    setModalShow(false);
                } 
        
            } catch (error: any) {
                console.log(error);
                // toast.error(error.response.data);
                toast.error(error.response.data);
            }   
        } else {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/teams/join-team`, {
                    teamName: teamNameInput,
                    password: passwordInput
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }  
                });
        
                if (response.status === 200) {      
                    dispatch(addTeams(response.data.team));
                    toast.success(response.data.message);
                    setModalShow(false);
                } 
        
            } catch (error: any) {
                console.log(error);
                // toast.error(error.response.data);
                toast.error(error.response.data);
            }   
        }   
    }  

    const deleteTeamHandler = async (event: React.FormEvent, teamId: number) => {
        event.stopPropagation();
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/teams/${teamId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }  
            })

            if (response.status === 200) {      
                dispatch(deleteTeam(teamId));
                toast.success(response.data.message);
            } 
        } catch (error: any) {
            console.log(error);
            // toast.error(error.response.data);
            toast.error(error.response.data);
        }   
    }

    const leaveTeamHandler = async (event: React.FormEvent, teamId: number) => {
        event.stopPropagation();
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/teams/${teamId}/leave-team`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }  
            })

            if (response.status === 200) {      
                dispatch(deleteTeam(teamId));
                toast.success(response.data.message);
            } 
        } catch (error: any) {
            console.log(error);
            // toast.error(error.response.data);
            toast.error(error.response.data);
        }   
    }

    return (
        <div className={classes.taskList}>
            <div className={classes.join} onClick={openCreateTeamHandler}>
                <p>Create New Team</p>
                <MdAdd size="32"/>
            </div>

            <div className={classes.join} onClick={openJoinTeamHandler}>
                <p>Join Team</p>
                <MdInput size="32"/>
            </div>

            {allTeams.map(team => (
                <div className={classes.task} key={team.id} onClick={() => navigate(`/all-teams/team/${team.id}`)}>
                    <h4>{team.name}</h4>

                    <div className={classes.CheckTrash}>
                        {userId === team.owner_id ? <Button variant="outline-dark" size="sm" onClick={(e) => deleteTeamHandler(e, team.id)}>
                            <FaTrash />
                        </Button> : null}
                        &nbsp;&nbsp;
                        <Button variant="outline-dark" size="sm" onClick={(e) => leaveTeamHandler(e, team.id)}>
                            <ImExit />
                        </Button>
                    </div>
                 
                    <p>Leader: {team.owner.name}</p> 
                       
                </div>
            ))}

            <Modal show={isModalShow} onHide={hideModalHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>{isCreateTeamModal ? "Create New Team" : "Join Team"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="teamName">Team Name</InputGroup.Text>
                        <Form.Control
                            // placeholder="Username"
                            aria-label="Team Name"
                            type="text"
                            required
                            ref={teamNameInputRef}
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="teamName">Password</InputGroup.Text>
                        <Form.Control
                            // placeholder="Username"
                            aria-label="Password"
                            type="password"
                            required
                            ref={passwordInputRef}
                        />
                    </InputGroup>

                    { isCreateTeamModal ?
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="teamName">Confirm Password</InputGroup.Text>
                        <Form.Control
                            // placeholder="Username"
                            aria-label="Confirm Password"
                            type="password"
                            required={isCreateTeamModal ? true : false}
                            ref={passwordConfirmInputRef}
                        />
                    </InputGroup> : null }

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={hideModalHandler}>Close</Button>
                    <Button variant="primary" onClick={modalSubmitHanlder}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    )
}

export default AllTeams;