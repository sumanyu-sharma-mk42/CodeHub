import React from 'react'
import { MessageSquare } from "lucide-react";

function NoChatSelected() {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-[#161b22]">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-[#238636]/10 flex items-center
             justify-center animate-pulse border border-[#238636]/20"
            >
              <MessageSquare className="w-8 h-8 text-[#238636]" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold text-white font-mono">Welcome to CodeHub!</h2>
        <p className="text-[#8b949e] font-mono">
          Select a conversation from the sidebar to start coding together
        </p>
        <div className="mt-8 p-4 bg-[#0d1117] rounded-lg border border-[#30363d] text-left">
          <p className="text-[#8b949e] text-sm font-mono">
            <span className="text-[#238636]">//</span> Features:
          </p>
          <ul className="mt-2 space-y-2 text-[#8b949e] text-sm font-mono">
            <li><span className="text-[#238636]">→</span> Real-time messaging</li>
            <li><span className="text-[#238636]">→</span> Code collaboration</li>
            <li><span className="text-[#238636]">→</span> Project showcase</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NoChatSelected