import React, { useState } from 'react'
import useChatStore from '../../store/useChatStore'
import { useAuthStore } from '../../store/useAuthStore';
import { X } from 'lucide-react';
import capitalizeWords from '../../lib/capitalize';

function ChatHeader() {
  const {selectedUser, setSelectedUser} = useChatStore();
  const {onlineUsers,setProfile} = useAuthStore();
  

  return (
    <div className="p-2.5 border-b border-[#30363d] bg-[#161b22]">
    <div className="flex items-center justify-between">
      {/* Clickable User Header */}
      <div
        className="flex flex-1 items-center gap-3 cursor-pointer hover:bg-[#1f2428] p-1 rounded-lg transition-colors"
        onClick={() => setProfile(true)}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="size-10 rounded-full">
            <img
              src={selectedUser.profilepic || "/avatar.png"}
              alt={selectedUser.fullname}
              className="w-full h-full object-cover rounded-full border border-[#30363d] hover:border-[#238636] transition-colors"
            />
          </div>
          <div 
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#161b22] z-10 ${
              onlineUsers.includes(selectedUser._id) ? "bg-[#238636]" : "bg-[#6e7681]"
            }`}
          />
        </div>

        {/* User info */}
        <div>
          <h3 className="font-medium text-white font-mono">{capitalizeWords(selectedUser.fullname)}</h3>
          <p className="text-sm text-[#8b949e] font-mono">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="p-1.5 hover:bg-[#1f2428] rounded-lg transition-colors text-[#8b949e] hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  </div>

  )
}

export default ChatHeader