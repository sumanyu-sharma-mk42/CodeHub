import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {Loader} from 'lucide-react'
import { useEffect } from 'react';

const ProtectRoute = ({children})=> {
    const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
    useEffect(()=>{
      checkAuth();
    },[checkAuth]);
    
    console.log({authUser,isCheckingAuth});
  
    if(isCheckingAuth){ // it loads untill  checking is done
      return(
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
      )
    }
    if(!authUser) return <Navigate to = "/login"/>;
    return children;
}

export default ProtectRoute;