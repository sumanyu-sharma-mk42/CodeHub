import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, MessageSquareCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../AuthImagePattern/AuthImagePattern';
import useChatStore from '../../store/useChatStore';

function Login() {
  const {login, isLoggingIn} = useAuthStore();
  const [showPassword, setPassword] = useState(false);
  const {setSelectedUser} = useChatStore();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const validateForm = ()=>{
    if(!formData.email || !formData.password) return toast.error("provide all the feilds");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("invalid email ID");
    if(formData.password.length<8) return toast.error("password must have atleast 8 characters");
    // here the password and email checking are function of the backend, they cant be done here

    return false;
  }

  useEffect(()=>{
    setSelectedUser(null)
  },[isLoggingIn])

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!validateForm()) login(formData);
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
              
              <p className="text-[#8b949e] font-mono">Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[#8b949e] font-mono">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <Mail className="size-5 text-[#8b949e]" />
                </div>
                <input
                  type="email"
                  className="input w-full pl-10 bg-[#161b22] text-white border-[#30363d] focus:border-[#238636] focus:outline-none font-mono"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[#8b949e] font-mono">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <Lock className="size-5 text-[#8b949e]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input w-full pl-10 bg-[#161b22] text-white border-[#30363d] focus:border-[#238636] focus:outline-none font-mono"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8b949e] hover:text-white transition-colors"
                  onClick={() => setPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn w-full bg-[#238636] hover:bg-[#2ea043] text-white border-none font-mono" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-[#8b949e] font-mono">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-[#238636] hover:text-[#2ea043] transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Log in to collaborate, code, and stay in sync with your developer community."
      />
    </div>
  )
}

export default Login