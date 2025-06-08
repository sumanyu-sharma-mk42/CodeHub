import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, Camera, User } from 'lucide-react';
import {useState} from 'react'
import Projects from './Projects';
import capitalizeWords from '../../lib/capitalize';

function Profilepage() {
  const {authUser, update, isUpdating} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState();

  const handleSubmit = (e)=>{
    const file  = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      update({profilepic: base64Image});
      
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-[#0d1117]">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-[#161b22] rounded-xl p-6 space-y-8 border border-[#30363d]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white font-mono">Profile</h1>
            <p className="mt-2 text-[#8b949e] font-mono">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilepic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-2 border-[#238636]"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-[#238636] hover:bg-[#2ea043]
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdating ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleSubmit}
                  disabled={isUpdating}
                />
              </label>
            </div>
            <p className="text-sm text-[#8b949e] font-mono">
              {isUpdating ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-[#8b949e] flex items-center gap-2 font-mono">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-[#0d1117] rounded-lg border border-[#30363d] text-white font-mono">{capitalizeWords(authUser.fullname)}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-[#8b949e] flex items-center gap-2 font-mono">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-[#0d1117] rounded-lg border border-[#30363d] text-white font-mono">{authUser.email}</p>
            </div>
          
            <div className="mt-6 bg-[#0d1117] rounded-xl p-6 border border-[#30363d]">
              <h2 className="text-lg font-medium mb-4 text-white font-mono">Account Information</h2>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-center justify-between py-2 border-b border-[#30363d] text-[#8b949e]">
                  <span>Member Since</span>
                  <span className="text-white">{authUser.createdAt.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-[#8b949e]">
                  <span>Account Status</span>
                  <span className="text-[#238636]">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Projects/>
    </div>
  )
}

export default Profilepage