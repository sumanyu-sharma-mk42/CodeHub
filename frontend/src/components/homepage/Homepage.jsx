import useChatStore from '../../store/useChatStore';
import React from 'react'
import NoChatSelected from '../chat/NoChatSelected';
import ChatContainer from '../chat/ChatContainer';
import Sidebar from '../sidebar/Sidebar';

function Homepage() {
  const {selectedUser} = useChatStore();
  return (
    <div className="h-[calc(100vh-4rem)] mt-16 bg-[#0d1117]">
      <div className="h-full">
        <div className="bg-[#161b22] h-full">
          <div className="flex h-full">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage