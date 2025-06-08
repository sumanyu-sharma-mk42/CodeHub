import React from 'react'
import { useState } from 'react';
import { User, Lock, LogOut , Settings} from 'lucide-react';


function SettingsPage() {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative z-50"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* Hover Target (Settings Button) */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#161b22] transition-colors font-mono cursor-pointer">
        <Settings className="size-6" />
      </div>

      {/* Sliding Settings Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 text-white shadow-lg transition-transform duration-300 ease-in-out ${
          show ? 'translate-x-0' : 'translate-x-full'
        } bg-[#0b3c14]`}  // <-- updated background color here
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#2ea043] mb-4">Settings</h2>

          {/* Settings Content */}
          <div className="space-y-4">
            <div className="p-3 rounded bg-[#161b22]">👤 Profile Settings</div>
            <div className="p-3 rounded bg-[#161b22]">🔒 Security Settings</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default SettingsPage