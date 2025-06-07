import React, { useState } from 'react'
import useChatStore from '../../store/useChatStore'
import { useAuthStore } from '../../store/useAuthStore';
import { X } from 'lucide-react';

function ChatHeader() {
  const {selectedUser, setSelectedUser} = useChatStore();
  const {onlineUsers,setProfile} = useAuthStore();
  

  return (
    <div className="p-2.5 border-b border-base-300">
    <div className="flex items-center justify-between">
      {/* Clickable User Header */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setProfile(true)}
      >
        {/* Avatar */}
        <div className="avatar">
          <div className="size-10 rounded-full relative">
            <img
              src={selectedUser.profilepic || "/avatar.png"}
              alt={selectedUser.fullname}
            />
          </div>
        </div>

        {/* User info */}
        <div>
          <h3 className="font-medium">{selectedUser.fullname}</h3>
          <p className="text-sm text-base-content/70">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Close button */}
      <button onClick={() => setSelectedUser(null)}>
        <X />
      </button>
    </div>
  </div>

  )
}

export default ChatHeader