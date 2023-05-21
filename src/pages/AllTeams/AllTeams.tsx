import React, { useContext, useEffect, useRef, useState } from "react";
import classes from './AllTeams.module.css';
import { MdAdd, MdInput } from "react-icons/md";
import { RiLockPasswordFill } from 'react-icons/ri';
import { ImExit } from "react-icons/im";
import { HiUsers } from "react-icons/hi"
import { Button, Form, InputGroup, Modal, OverlayTrigger, ToastContainer, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addTeams, askToLeaveTeam, deleteTeam, fetchTeams } from "../../redux/actions/teams";
import { RootState } from "../AllTasks/AllTasks";
import { AuthContext } from "../../contexts/AuthContext";
import jwtDecode from "jwt-decode";
import { FaTrash } from "react-icons/fa";
import { User } from "../TeamTasks/TeamTasks";

export interface Team {
    id: number,
    name: string,
    password: string,
    owner_id: number,
    owner: {
        name: string
    },
    members: User[]
}

const AllTeams: React.FC = props => {
    const navigate = useNavigate();
    const [isModalShow, setModalShow] = useState<boolean>(false);
    const [isCreateTeamModal, setIsCreateTeamModal] = useState<boolean>(false);
    const [isUpdatePasswordModal, setIsUpdatePasswordModal] = useState<boolean>(false);
    const teamNameInputRef = useRef<HTMLInputElement>(null);
    const oldPasswordInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const passwordConfirmInputRef = useRef<HTMLInputElement>(null);
    const teams = useSelector((state: RootState)=> state.teams.teams);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const [ userId, setUserId ] = useState<number | null>(null);
    const [allMembers, setAllMembers] = useState<User[]>([]);
    const [isMemberModalShow, setIsMemberModalShow] = useState<boolean>(false);
    const [selectedTeam, setSelectedTeam] = useState<Team>();

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
        setAllTeams(teams ? teams : []);
    }, [teams])

    const hideModalHandler = () => {
        setModalShow(false);
    }

    const openCreateTeamHandler = () => {
        setIsCreateTeamModal(true);
        setIsUpdatePasswordModal(false);
        setModalShow(true);
    }

    const openJoinTeamHandler = () => {
        setIsCreateTeamModal(false);
        setIsUpdatePasswordModal(false);
        setModalShow(true);
    }

    const openUpdatePasswordHandler = (event: React.FormEvent, team: Team) => {
        event.stopPropagation();
        setIsUpdatePasswordModal(true);
        setIsCreateTeamModal(true);
        setSelectedTeam(team);
        setModalShow(true);
    }

    const modalSubmitHanlder = async () => {
        const teamNameInput = teamNameInputRef.current?.value;
        const oldPasswordInput = oldPasswordInputRef.current?.value;
        const passwordInput = passwordInputRef.current?.value;
        const passwordConfirmInput = passwordConfirmInputRef.current?.value;

        if (isUpdatePasswordModal) {            // update password
            if (passwordInput !== passwordConfirmInput) {
                toast.error('Password does not match');
                return;
            }

            try {
                const token = localStorage.getItem('token');

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/teams/change-password`, {
                    teamId: selectedTeam!.id,
                    oldPassword: oldPasswordInput,
                    newPassword: passwordInput
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }  
                });
        
                if (response.status === 201) {      
                    toast.success(response.data.message);
                    setModalShow(false);
                } 
        
            } catch (error: any) {
                console.log(error);
                // toast.error(error.response.data);
                toast.error(error.response.data);
            }   
        } else if (isCreateTeamModal) {            // create new team
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
        } else {                // join team
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

    const showTooltip = (text: string) => (
        <Tooltip id={text}>
            {text}
        </Tooltip>
    );

    const showMembersHandler = (event: React.FormEvent, team: Team) => {
        event.stopPropagation();
        setAllMembers(team.members);
        setSelectedTeam(team);
        setIsMemberModalShow(true);
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
                 
                    <p>Leader: {team.owner.name}</p> 

                    <div className={classes.CheckTrash}>
                        {userId === team.owner_id ?
                        <OverlayTrigger placement="left" overlay={showTooltip('All Members')}>
                            <Button variant="outline-dark" size="sm" onClick={(e) => showMembersHandler(e, team)}>
                                <HiUsers />
                            </Button>
                        </OverlayTrigger> : null}
                        &nbsp;&nbsp;
                        {userId === team.owner_id ?
                        <OverlayTrigger placement="top" overlay={showTooltip('Delete Team')}>
                            <Button variant="outline-dark" size="sm" onClick={(e) => deleteTeamHandler(e, team.id)}>
                                <FaTrash />
                            </Button>
                        </OverlayTrigger> : null}
                        &nbsp;&nbsp;
                        {userId === team.owner_id ?
                        <OverlayTrigger placement="top" overlay={showTooltip('Change Password')}>
                            <Button variant="outline-dark" size="sm" onClick={(e) => openUpdatePasswordHandler(e, team)}>
                                <RiLockPasswordFill />
                            </Button>
                        </OverlayTrigger> : null}
                        &nbsp;&nbsp;
                        <OverlayTrigger placement="right" overlay={showTooltip('Leave Team')}>
                            <Button  variant="outline-dark" size="sm" onClick={(e) => leaveTeamHandler(e, team.id)}>
                                <ImExit />
                            </Button>
                        </OverlayTrigger>
                    </div>
                       
                </div>
            ))}

            <Modal show={isModalShow} onHide={hideModalHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>{isUpdatePasswordModal ? 'Update New Password' : (isCreateTeamModal ? "Create New Team" : "Join Team")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isUpdatePasswordModal ? null :
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="teamName">Team Name</InputGroup.Text>
                        <Form.Control
                            // placeholder="Username"
                            aria-label="Team Name"
                            type="text"
                            required={isUpdatePasswordModal ? false : true}
                            ref={teamNameInputRef}
                        />
                    </InputGroup>}
                        
                    {isUpdatePasswordModal ? 
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="oldPassword">Old Password</InputGroup.Text>
                        <Form.Control
                            aria-label="Password"
                            type="password"
                            required={isUpdatePasswordModal ? true : false}
                            ref={oldPasswordInputRef}
                        />
                    </InputGroup> : null }

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="password">Password</InputGroup.Text>
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
                        <InputGroup.Text id="confirmPassword">Confirm Password</InputGroup.Text>
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

            {/* all members modal */}
            <Modal show={isMemberModalShow} onHide={() => setIsMemberModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>All Members</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ol>
                        {allMembers.map((mem: User) => (
                            <li key={mem.id} className={classes.liMember}>
                                {mem.name} {selectedTeam?.owner_id === mem.id ? '(Leader)' : null}
                                { selectedTeam?.owner_id === mem.id ? null :
                                    <Button  variant="outline-dark" size="sm" onClick={() => {dispatch(askToLeaveTeam(mem.id, selectedTeam!.id)); setIsMemberModalShow(false)}}>
                                        Ask To Leave
                                    </Button>}
                            </li>
                        ))}
                    </ol>
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </div>
    )
}

export default AllTeams;