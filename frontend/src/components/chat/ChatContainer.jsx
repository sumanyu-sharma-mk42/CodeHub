import React, { useEffect, useRef, useState } from 'react'
import useChatStore from '../../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './MessageSkeleton';
import { useAuthStore } from '../../store/useAuthStore';
import {formatMessageTime} from '../../lib/formatMessageTime'
import { useCodeStore } from '../../store/useCodeStore';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import capitalizeWords from '../../lib/capitalize';

function ChatContainer() {
  const {messages, getMessages, selectedUser, isLoadingMessages, subscribeToMessage, unsubscribeFromMessages} = useChatStore();
  const {authUser, profile, setProfile} = useAuthStore();
  const messageEndRef = useRef(null);
  const navigate = useNavigate();
  const [selectedProject,setSelectedProject] = useState(null);
  const [dateInfo, setDateInfo] = useState(""); // see later
  const profileRef = useRef(null);

  useEffect(()=>{
    setProfile(false) // so that when the user changes then it's profile is not opened first
    getMessages(selectedUser._id);  // although async function bu not use await inside useffect
    subscribeToMessage();
    return ()=>unsubscribeFromMessages();
  },[selectedUser._id, getMessages,unsubscribeFromMessages,subscribeToMessage]);

  // Scroll to top when profile is opened
  useEffect(() => {
    if (profile && profileRef.current) {
      profileRef.current.scrollTop = 0;
    }
  }, [profile]);

  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  },[messages])
  console.log(messages);

  const handleClick = (sessionId)=>{
    if(sessionId) navigate(`/editor/${sessionId}`)
  }
  

  if(profile) 
    return (
      <div className="flex-1 flex flex-col bg-[#0d1117]">
        {/* Fixed Back button */}
        <div className="p-4 border-b border-[#30363d] bg-[#0d1117] sticky top-0 z-10">
          <button
            onClick={() => setProfile(false)}
            className="flex items-center text-sm text-[#238636] hover:text-[#2ea043] transition-colors font-mono"
          >
            ← Back to chat
          </button>
        </div>

        {/* Scrollable Profile content */}
        <div ref={profileRef} className="flex-1 overflow-y-auto">
          <div className="p-4 flex flex-col items-center">
            <div className="mb-4">
              <img
                src={selectedUser.profilepic || "/avatar.png"}
                alt={selectedUser.fullname}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#238636]"
              />
            </div>

            {/* Heading */}
            <h2 className="text-lg font-semibold mb-3 text-white font-mono">
              {capitalizeWords(selectedUser.fullname)}'s Projects
            </h2>

            {/* Projects list */}
            <div className="w-full max-w-3xl">
              <div className="flex flex-col gap-4">
                {selectedUser.experience?.map((project, index) => (
                  <div
                    key={index}
                    className="w-full bg-[#161b22] border border-[#30363d] hover:border-[#238636] p-4 rounded-lg cursor-pointer transition-colors"
                    onClick={() => setSelectedProject(project)}
                  >
                    <h3 className="text-lg font-semibold text-white font-mono mb-2 line-clamp-1">{capitalizeWords(project.title)}</h3>
                    <p className="text-sm text-[#8b949e] font-mono line-clamp-2 mb-2">
                      {project.content}
                    </p>
                    <p className="text-xs text-[#6e7681] font-mono">
                      {project?.from?.split("T")[0]} - {project?.to?.split("T")[0] || "Present"}
                    </p>
                  </div>
                ))}
                {selectedUser.experience.length==0 && (
                  <div className="text-center text-[#8b949e] italic py-10 font-mono">
                    No projects added yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#161b22] text-white p-6 rounded-xl w-full max-w-2xl max-h-[80vh] relative border border-[#30363d] shadow-lg flex flex-col">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-[#8b949e] hover:text-white transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>

              {/* Scrollable content container */}
              <div className="flex-1 flex flex-col w-full overflow-y-auto mt-6 pr-2">
                <h3 className="text-xl font-bold mb-3 text-white font-mono break-words">{capitalizeWords(selectedProject.title)}</h3>
                <div className="bg-[#0d1117] p-4 rounded-lg mb-4">
                  <p className="text-[#8b949e] whitespace-pre-wrap break-words font-mono">
                    {selectedProject.content}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-[#6e7681] font-mono">
                    {selectedProject?.from?.split("T")[0]} - {selectedProject?.to?.split("T")[0] || "Present"}
                  </p>
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#238636] hover:text-[#2ea043] transition-colors font-mono break-all"
                    >
                      {selectedProject.link}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );

  if(isLoadingMessages) return(
    <div className="flex-1 flex flex-col overflow-auto bg-[#0d1117]">
      <ChatHeader/>
      <MessageSkeleton/>
    </div>
  )
  

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-[#0d1117]">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {messages.map((message) => {
          

          return (
          
          <div
            key={message._id}
            className={`chat ${message.senderID === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef} // this gives referrence to the last message sent always
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border border-[#30363d] hover:border-[#238636] transition-colors">
                <img
                  src={
                    message.senderID === authUser._id
                      ? authUser.profilepic || "/avatar.png"
                      : selectedUser.profilepic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs text-[#8b949e] ml-1 font-mono">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble flex flex-col ${
              message.senderID === authUser._id
                ? "bg-[#0b5c1d] text-white"
                : "bg-[#161b22] text-white border border-[#30363d]"
            } font-mono`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 border border-[#30363d]"
                />
              )}
              {message.text && <p>{message.text}</p>}
              {message.code && (
                <>
                  <p className="mb-2">Hey! Let's code together</p>
                  <button
                    className="btn bg-[#0d1117] text-white hover:bg-[#1f2428] border-[#30363d] hover:border-[#238636] rounded-xl btn-sm sm:btn-md w-fit transition-colors font-mono"
                    onClick={()=>handleClick(message.code)}
                  >
                    Join Editor
                  </button>
                </>
              )}
            </div>
          </div>
        )})}
      </div>

      <MessageInput />
    </div>
    
  )
}

export default ChatContainer