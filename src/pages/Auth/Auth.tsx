import React, { useContext, useRef, useState } from "react";
import { Form, Button } from 'react-bootstrap';
import classes from './Auth.module.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Auth: React.FC = props => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const emailInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const switchModeHandler = () => {
      setIsLoginMode((prevState) => !prevState);
    };
  
    const submitHandler = async (event: React.FormEvent) => {
      event.preventDefault();
      // do something with form data

      const apiUrl = isLoginMode ? `${process.env.REACT_APP_API_URL}/auth/login` : `${process.env.REACT_APP_API_URL}/auth/signup`;
      try {
        const response = await axios.post(apiUrl, {
            name: nameInputRef.current?.value,
            email: emailInputRef.current?.value,
            password: passwordInputRef.current?.value,   
        });

        if (response.status === 200 && isLoginMode) {       // sign in
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            navigate('/all-tasks');
        } else if (response.status === 200 && !isLoginMode) {    // sign up
            switchModeHandler();
        }

      } catch (error) {
        console.log(error);
      }

      
    };

    

    return (
        <div className={classes.AuthContainer}>
            <Form onSubmit={submitHandler} className={classes.Form}>
                <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="Enter email" ref={emailInputRef}/>
                </Form.Group>

                {!isLoginMode && (
                    <Form.Group controlId="formBasicName" className="mb-3">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control required={isLoginMode ? false : true} type="text" placeholder="Enter name" ref={nameInputRef}/>
                    </Form.Group>
                )}

                <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" ref={passwordInputRef}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    {isLoginMode ? 'Login' : 'Sign Up'}
                </Button>

                <Button variant="secondary" type="button" className="mx-3" onClick={switchModeHandler}>
                    Switch to {isLoginMode ? 'Sign Up' : 'Login'}
                </Button>
            </Form>
        </div>
    );
}

export default Auth;
