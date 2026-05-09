import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAppData } from '../../app/context/AppDataContext';

function PrivateRoute({publicPage = false }) {
    const { user } = useAppData();
    const loggedUser = user?.user || user;
  if(publicPage){
    return loggedUser ? <Navigate to="/"/> : <Outlet/>
  }
    return loggedUser ? <Outlet/>:<Navigate to="/login"/> 

}

export default PrivateRoute
