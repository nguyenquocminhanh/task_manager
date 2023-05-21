import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { User } from '../pages/TeamTasks/TeamTasks';

interface Props {
  children: ReactNode
}

const WithMembership = ({ children }: Props) => {
  const [ isMembership, setIsMembership ]= useState<boolean>(true);
  const { teamId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${process.env.REACT_APP_API_URL}/teams/${teamId}/members`, {
        headers: {
            Authorization: `Bearer ${token}`
        }  
    }).then(response => {
        const allMembers = response.data.members;
        const decodedToken: {userId: number} = jwtDecode(token!);
        const isAutthorized = allMembers.some((user: User) => user.id === decodedToken.userId);
        if (!isAutthorized) {
            setIsMembership(false)
        }
    }).catch(error => {
        console.log(error);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMembership) {
    return <Navigate to="/all-teams" replace/>
  }
  return <>{children}</>;
};

export default WithMembership;