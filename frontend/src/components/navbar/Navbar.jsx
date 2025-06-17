import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { LogOut, MessageSquare, MessageSquareCode, User } from 'lucide-react';
import SettingsPage from '../settings/SettingsPage.jsx';
import { Link } from 'react-router-dom';

function Navbar() {
  const {logout, authUser} = useAuthStore();

  return (
    <header className="bg-[#0d1117] border-b border-[#30363d] fixed w-full top-0 z-40 backdrop-blur-lg bg-[#0d1117]/80">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full w-full">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-[#238636]/10 flex items-center justify-center">
                <MessageSquareCode className="w-5 h-5 text-[#238636]" />
              </div>
              <h1 className="text-lg font-bold text-white font-mono">CodeHub</h1>
            </Link>
          </div>
  
          {/* Right: Profile + Logout */}
          <div className="flex items-center gap-3 sm:gap-5">
            {authUser && (
              <>
                <Link to="/profile" className="flex items-center gap-2">
                  <img
                    src={authUser?.profilepic || "/avatar.png"}
                    alt="Profile"
                    className="size-10 rounded-full object-cover border border-[#30363d] hover:border-[#238636] transition-colors"
                  />
                </Link>
  
                <button 
                  onClick={logout}
                  className="flex gap-2 items-center px-3 py-2 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#161b22] transition-colors font-mono text-sm"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
  
        </div>
      </div>
    </header>
  )
  
}

export default Navbar