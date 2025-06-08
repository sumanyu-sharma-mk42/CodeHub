import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useChatStore from '../../store/useChatStore'
import SideBarSkeleton from './SideBarSkeleton';
import { Loader, Loader2, Users } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import debounce from 'lodash';

function Sidebar() {
  const {users, getUsers, selectedUser, setSelectedUser, isLoadingUsers,isSearching,searchBar} = useChatStore();
  const {onlineUsers,authUser} = useAuthStore();
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
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
    {/* Header */}
    <div className="border-b border-base-300 w-full p-5">
      <div className="flex items-center gap-2">
        <Users className="size-6" />
        <span className="font-medium hidden lg:block">Contacts</span>
      </div>

      {/* search bar */}
      <div className="mt-4 px-3 py-2 bg-base-100 rounded-md min-h-[48px]">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full input input-sm input-bordered"
          value={searchTerm}
          onChange={(e)=>{setSearchTerm(e.target.value)}}
        />
      </div>
    </div>
    
    {/* Main content: filter toggle Scrollable list */}
    <div className="flex-1 flex flex-col min-h-0">

      {/* Online filter toggle */}
      {!searchUsers && <div className="mt-3 hidden lg:flex items-center justify-between px-5">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineUsers}
            onChange={(e) => setShowOnlineUsers(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">Show online only</span>
        </label>

        <span className="text-xs text-zinc-500">
          ({onlineUsers.length - 1} online)
        </span>
      </div>}

      {/* Scrollable Users List */}
      {(isSearching)?
      <div className="flex-1 flex justify-center items-center overflow-y-auto w-full py-3">
        <Loader className="size-5 animate-spin text-zinc-500" />
      </div>

      :<>
      <div className="flex-1 overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilepic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* User info */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
      </>}
    </div>
  </aside>

  )
}

export default Sidebar