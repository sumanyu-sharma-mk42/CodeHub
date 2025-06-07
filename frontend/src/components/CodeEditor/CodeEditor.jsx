import React, { useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react';
import { useParams } from "react-router-dom";

import { useNavigate } from 'react-router-dom';
import useChatStore from '../../store/useChatStore';
import { useCodeStore } from '../../store/useCodeStore';
import { Loader, X } from 'lucide-react';

function CodeEditor() {
    const [isEditorReady, setIsEditorReady] = useState(false);
    const {getCode,session,saveChange,isSaving,setSession,updateCodeRealTime,roomUsers,closeSession} = useCodeStore();
    const navigate = useNavigate();
    const { sessionID } = useParams();

    useEffect(()=>{
      if(sessionID) getCode(sessionID);
    },[getCode,sessionID])

    const handleEditorChange = (e)=>{
      if(!session) return;
      setSession({...session, content: e});
      updateCodeRealTime();
    }

    const handleLanguageChange = (e)=>{
      if(!session) return;
      setSession({...session, language: e.target.value});
      updateCodeRealTime();
    }

    const handleSave = async ()=>{
      await saveChange();
    }

    const closingSession = ()=>{
      closeSession();
      navigate("/");
    }

    if (!session || isSaving || !roomUsers) {
      return(
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
          {isSaving?<p>Saving Code</p>:<></>}
        </div>
      )
    }
    console.log(roomUsers[0]);

    

  return (
    <div className="w-full h-screen bg-base-200 flex">
      {/* Sidebar - Online Users */}
      <div className="w-64 bg-base-300 p-4 border-r border-zinc-700">
        <h3 className="text-md font-semibold text-white mb-4">Online Users: {roomUsers.length}</h3>
        <div className="flex flex-col gap-4">
          {roomUsers && roomUsers.length > 0 ? (
            roomUsers.map((userId) => (
              <div
                key={userId._id}
                className="relative flex items-center gap-3 bg-zinc-800 p-2 rounded-lg"
              >
                <img
                  src={userId.profilepic || "/avatar.png"}
                  alt={userId.fullname}
                  className="size-10 object-cover rounded-full border border-white"
                />
                <span className="text-white text-sm">{userId.fullname}</span>
                <span className="absolute bottom-1 left-8 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No users online</p>
          )}
        </div>
      </div>

      {/* Main Editor + Header */}
      <div className="flex-1 p-6 flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-1">Live Code Session</h2>
            <p className="text-sm text-gray-400">
              Session ID: <span className="font-mono">{sessionID}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="select select-sm bg-base-100 border border-zinc-600 text-white relative top-4 right-4"
              value={session?.language}
              onChange={handleLanguageChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
            </select>

            <button
              onClick={handleSave}
              className="btn btn-sm bg-green-600 text-white hover:bg-green-700 rounded-xl relative top-4 right-4"
              disabled={isSaving}
            >
              Save
            </button>

            <button onClick={closingSession} className="text-zinc-400 hover:text-red-500 transition relative -top-5" >
              <X className="size-6"/>
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-grow rounded-lg overflow-hidden border border-zinc-700">
          <Editor
            height="100%"
            language={session?.language}
            theme="vs-dark"
            value={session?.content}
            onChange={handleEditorChange}
            onMount={() => setIsEditorReady(true)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>

  );
  
}

export default CodeEditor