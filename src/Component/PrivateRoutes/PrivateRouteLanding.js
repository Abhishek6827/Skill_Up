import React from 'react'
import { Navigate } from 'react-router-dom' 
import { useAuth } from '../../AuthContext'

const PrivateRouteLanding = ({children}) => {
    const {currentUser} = useAuth();
    if(!currentUser)
    {
        return <Navigate to='/signup'/>;
    }
  return children
}

export default PrivateRouteLanding