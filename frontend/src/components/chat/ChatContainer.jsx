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

function ChatContainer() {
  const {messages, getMessages, selectedUser, isLoadingMessages, subscribeToMessage, unsubscribeFromMessages} = useChatStore();
  const {authUser, profile, setProfile} = useAuthStore();
  const messageEndRef = useRef(null);
  const navigate = useNavigate();
  const [selectedProject,setSelectedProject] = useState(null);
  const [dateInfo, setDateInfo] = useState(""); // see later

  useEffect(()=>{
    setProfile(false) // so that when the user changes then it's profile is not opened first
    getMessages(selectedUser._id);  // although async function bu not use await inside useffect
    subscribeToMessage();
    return ()=>unsubscribeFromMessages();
  },[selectedUser._id, getMessages,unsubscribeFromMessages,subscribeToMessage]);

// here dont think why getUser called once and what will happen when new mssg is sent
// look the sendingMessage function in the useChatStore, this function itself adds the new mssg in the message array
// as a result the message changes so the state changes and because of which there is no need for the getMessages to run so it does not have any other var in its dependency array


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
      <div className="p-4 flex-1 flex flex-col overflow-auto ">
        {/* Back button */}
        <button
          onClick={() => setProfile(false)}
          className="mb-4 flex items-center text-sm text-blue-500 hover:underline"
        >
          ← Back to chat
        </button>
        <div className="flex justify-center mb-4">
          <img
            src={selectedUser.profilepic || "/avatar.png"}
            alt={selectedUser.fullname}
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
          />
        </div>
  
        {/* Heading */}
        <h2 className="text-lg font-semibold mb-3">
          {selectedUser.fullname}'s Projects
        </h2>
  
        {/* Scrollable project list */}
        <div className="flex-1 overflow-y-auto w-full pr-1">
          <div className="space-y-4 flex flex-col">
            {(selectedUser.experience || []).map((project, index) => (
              <div
                key={index}
                className="w-full mx-2 max-w-[48rem] h-28 bg-zinc-900 border border-zinc-700 hover:shadow-xl p-5 rounded-xl cursor-pointer transition duration-200"
                onClick={() => setSelectedProject(project)}
              >
                <h3 className="text-lg font-semibold text-white break-words">{project.title}</h3>

                <p
                  className="text-sm text-zinc-400 overflow-hidden text-ellipsis"
                  style={{ maxHeight: "3.6em" }} // roughly 3 lines of text
                >
                  {project.content}
                </p>

                <p className="text-xs text-zinc-500 mt-2">
                  {project?.from?.split("T")[0]} - {project?.to?.split("T")[0] || "Present"}
                </p>
              </div>
            ))}
            {selectedUser.experience.length==0 && (<div className="text-center text-zinc-400 italic py-10">
            No projects added yet.
          </div>)}
          </div>
        </div>


  
        {/* Modal */}
        {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 text-white p-6 rounded-xl w-full max-w-md h-[80vh] relative border border-zinc-700 shadow-lg flex flex-col">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
              onClick={() => setSelectedProject(null)}
            >
              <X size={20} />
            </button>

            {/* Scrollable content container */}
            <div className="flex-1 flex flex-col w-full overflow-y-auto mt-6">
              <h3 className="text-xl font-bold mb-2">{selectedProject.title}</h3>
              <p className="text-zinc-300 mb-3 whitespace-normal break-words">
                {selectedProject.content}
              </p>
              <p className="text-sm text-zinc-500 mb-2">
                {selectedProject?.from?.split("T")[0]} - {selectedProject?.to?.split("T")[0] || "Present"}
              </p>
              {selectedProject.url && (
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Visit Project
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      </div>
    );

  if(isLoadingMessages) return(
    <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader/>
        <MessageSkeleton/>
        <MessageInput/>
    </div>
  )
  

  return (
    <div className="flex-1 flex flex-col overflow-auto">
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
              <div className="size-10 rounded-full border">
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
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
              {message.code && (
                <>
                  <p className="mb-2">Hey! Let's code together</p>
                  <button
                    className="btn bg-black text-white hover:bg-zinc-800 rounded-xl btn-sm sm:btn-md w-fit"
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