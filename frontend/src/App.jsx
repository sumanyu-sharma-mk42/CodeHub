import React, { useEffect } from 'react'
import Navbar from './components/navbar/Navbar.jsx'
import {Navigate, Route, Routes, useLoaderData, useLocation} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Homepage from './components/homepage/Homepage.jsx'
import Signup from './components/signup/Signup.jsx'
import Login from './components/login/Login.jsx'
import Settings from './components/settings/SettingsPage.jsx'
import Profilepage from './components/profilepage/Profilepage.jsx'

import {Loader} from 'lucide-react'
import { useAuthStore } from './store/useAuthStore.js'
import CodeEditor from './components/CodeEditor/CodeEditor.jsx'
import useChatStore from './store/useChatStore.js'

function App() {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {selectedUser} = useChatStore();
  const location = useLocation();
  const isEditor = location.pathname.startsWith("/editor");
  useEffect(()=>{
      checkAuth();
    },[checkAuth]); // this useEffect will run only on the initial render and not on re-renders in the future this is because of the checkAuth dependency
    
    console.log({authUser,isCheckingAuth});
    console.log(onlineUsers)
  
    if(isCheckingAuth && !authUser){ // it loads untill  checking is done
      return(
        <div className="flex flex-col items-center justify-center h-screen text-white font-mono space-y-4">
          <Loader className="size-10 animate-spin text-[#2ea043]" />
          <p>Loading... Render-hosted backend may take a moment.</p>
        </div>
      )
    }

  return (
    <>
      {!isEditor && <Navbar/>}

      <Routes>
        <Route path='/' element = {authUser ? <Homepage/> : <Navigate to="/login"/>} />
        <Route path='/signup' element = {!authUser ?  <Signup/> : <Navigate to="/"/>} />
        <Route path='/login' element = {!authUser ?  <Login/> : <Navigate to="/"/>} />
        {/* <Route path='/settings' element = {<Settings/>} /> */}
        <Route path='/profile' element = {authUser ? <Profilepage/> : <Navigate to="/login"/>} />
        <Route path='/editor/:sessionID' element = {authUser ?  <CodeEditor /> : <Navigate to="/"/>} /> {/* error not working */}
      </Routes> {/* // see the isuee with the offline becoming -1 due to the last route */}

      <Toaster/>
    </>
  )
}

export default App