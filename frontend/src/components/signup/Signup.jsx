import React, { useEffect, useState } from 'react'
import { MessageSquare, User, Mail, Lock, Eye, EyeOff, Loader2, UserCircle, MessageSquareCode} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import AuthImagePattern from '../AuthImagePattern/AuthImagePattern.jsx';
import toast from 'react-hot-toast';
import useChatStore from '../../store/useChatStore.js';

function Signup() {
  const [showPassword, setPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: ""
  })
  const {setSelectedUser} = useChatStore();
  const {signup, isSigningUp} = useAuthStore();

  const validateForm = ()=>{
    if(!formData.fullname) return toast.error("full name is required");
    if(!formData.email) return toast.error("email is required");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("invalid email ID");
    if(!formData.password) return toast.error("password is required");
    if(formData.password.length<8) return toast.error("password must have atleast 8 characters");
    return false;  // here false because when we return toast it is taken as true, so just to distinguish I have used false here
  }

  useEffect(()=>{
    setSelectedUser(null)
  },[isSigningUp])

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!validateForm()){ signup(formData);}
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 pt-16 bg-[#0d1117]">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-[#238636]/10 flex items-center justify-center 
              group-hover:bg-[#238636]/20 transition-colors"
              >
                <MessageSquareCode className="size-6 text-[#238636]" />
              </div>
              
              <h1 className="text-2xl font-bold mt-2 text-white">Create Account</h1>
              <p className="text-[#8b949e]">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[#8b949e]">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center z-50">
                  <User className="size-5 text-[#8b949e]" />
                </div>
                <input
                  type="text"
                  className="input w-full pl-10 bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e] focus:border-[#8b949e] focus:outline-none"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[#8b949e]">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <Mail className="size-5 text-[#8b949e]" />
                </div>
                <input
                  type="email"
                  className="input w-full pl-10 bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e] focus:border-[#8b949e] focus:outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[#8b949e]">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <Lock className="size-5 text-[#8b949e]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input w-full pl-10 bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e] focus:border-[#8b949e] focus:outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-[#8b949e]" />
                  ) : (
                    <Eye className="size-5 text-[#8b949e]" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 p-2 bg-[#238636] hover:bg-[#2ea043] text-white border-none font-mono" 
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-[#8b949e]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#58a6ff] hover:text-[#79c0ff]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with fellow developers, share code, and build together in real time."
      />
    </div>
  )
}

export default Signup