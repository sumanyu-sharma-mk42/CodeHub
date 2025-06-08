import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useChatStore from '../../store/useChatStore'
import SideBarSkeleton from './SideBarSkeleton';
import { Loader, Loader2, Users, Search, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import debounce from 'lodash';
import capitalizeWords from '../../lib/capitalize';

function Sidebar() {
  const {users, getUsers, selectedUser, setSelectedUser, isLoadingUsers,isSearching,searchBar} = useChatStore();
  const {onlineUsers,authUser,logout} = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [searchUsers, setSearchUsers] = useState(null);

  useEffect(()=>{
    getUsers();
  },[getUsers])


  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim() === '' ) {setSearchUsers(""); return}
  
      try {
        const result = await searchBar(searchTerm, 'live');
        console.log("thisss", result);
        setSearchUsers(result);
      } catch (err) {
        console.error('Search error:', err);
      } 
    }, 500); // debounce delay in ms
  
    return () => clearTimeout(delayDebounce); //React uses returned function as a cleanup to run before re-running the effect or unmounting the component on any dependency change.
  }, [searchTerm]); // runs every time searchTerm change


  
  
  if(isLoadingUsers) return <SideBarSkeleton/>

  const filteredUsers = searchUsers? searchUsers.filter((user)=>user._id!=authUser._id) : showOnlineUsers ? users.filter((user)=>onlineUsers.includes(user._id)):users;

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-r border-[#30363d] w-32 lg:w-96">
        {/* Search Bar */}
        <div className="p-4 border-b border-[#30363d]">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#161b22] text-white border border-[#30363d] rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-[#238636] font-mono"
                />
                <Search className="absolute left-3 top-2.5 text-[#8b949e]" size={18} />
            </div>
        </div>

        {/* Online Filter Toggle */}
        {!searchTerm && (
            <div className="px-4 py-2 border-b border-[#30363d]">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showOnlineUsers}
                            onChange={(e) => setShowOnlineUsers(e.target.checked)}
                            className="checkbox checkbox-sm border-[#30363d] bg-[#161b22] checked:bg-[#238636] checked:border-[#238636]"
                        />
                        <span className="text-sm text-[#8b949e] font-mono">Show online only</span>
                    </label>
                    <span className="text-xs text-[#6e7681] font-mono">
                        ({onlineUsers.length - 1} online)
                    </span>
                </div>
            </div>
        )}

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
            {isSearching ? (
                <div className="flex justify-center items-center h-full">
                    <div className="loading loading-spinner text-[#238636]"></div>
                </div>
            ) : (
                <div className="p-2">
                    {filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedUser?._id === user._id
                                    ? "bg-[#163a19] text-white"
                                    : "hover:bg-[#161b22] text-[#8b949e]"
                            }`}
                        >
                            <div className="relative">
                                <img
                                    src={user.profilepic || "/avatar.png"}
                                    alt={user.fullname}
                                    className="w-10 h-10 rounded-full object-cover border border-[#30363d] hover:border-[#238636] transition-colors"
                                />
                                <div
                                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d1117] ${
                                        onlineUsers.includes(user._id) ? "bg-[#238636]" : "bg-[#6e7681]"
                                    }`}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-medium truncate font-mono ${
                                    selectedUser?._id === user._id ? "text-white" : "text-white"
                                }`}>
                                    {capitalizeWords(user.fullname)}
                                </h3>
                                <p className="text-sm truncate font-mono">
                                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                </p>
                            </div>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="text-center text-[#8b949e] py-4 font-mono">
                            No users found
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#30363d]">
            <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 p-2 bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#1f2428] rounded-lg transition-colors font-mono"
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </div>
    </div>
  )
}

export default Sidebar