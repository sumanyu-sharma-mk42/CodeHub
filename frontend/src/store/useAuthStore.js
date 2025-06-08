import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";
import { useCodeStore } from './useCodeStore.js';

const BASE_URL = "https://codehub-hkx5.onrender.com";

export const useAuthStore = create((set,get)=>({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false, 
    isUpdating: false,
    onlineUsers: [],
    socket: null,
    profile: false,

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data});
            get().connectSocket();  // since check tells whether the user is auth on reload, so it should connect to the socket as well
        } catch (error) {
            set({authUser: null});
        } finally{
            set({isCheckingAuth: false});
        }
    },
    signup: async (data)=>{
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            toast.success("Account created successfully");
            set({authUser: res.data});
            get().connectSocket();
            
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(1);
        }finally{
            set({isSigningUp: false});
        }
    },
    logout: async ()=>{
        try {
            const res = await axiosInstance.post("/auth/logout");
            toast.success("logged out");
            set({authUser: null});
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    login: async (data)=>{
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            toast.success("logged in successfully");
            set({authUser: res.data});
            get().connectSocket() // as soon as the user is logged in it should connect to the socket
           
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false});
        }
    },
    update: async (data)=>{
        set({isUpdating: true});
        try {
            const res = await axiosInstance.put("/auth/profile",data);
            toast.success("image updated successfully");
            set({authUser: res.data});
        } catch (error) {
            toast.error(error?.response?.data?.message || "smething went wrong");
        }finally{
            set({isUpdating: false});
        }
    },
    connectSocket: ()=>{
        if(get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query: {
                userID: get().authUser._id,
            }
        });
        socket.connect();
        set({socket:socket});

        socket.on("getOnlineUsers",(userIDS)=>{ // this is only called once then it listens for all the time
            set({onlineUsers: userIDS});
        })

    },
    disconnectSocket: ()=>{
        if(get().socket?.connected){
            get().socket.disconnect();
            set({socket:null});
        }
    },
    deleteProject: async (index)=>{
        try {
            const res = await axiosInstance.get(`/auth/delete/${index}`);
            set({authUser: res.data});
        } catch (error) {
            toast.error(error?.response?.data?.message || "smething went wrong");
        }
    },
    addingProject: async (data)=>{
        try {
            const res = await axiosInstance.put("/auth/add/",data);
            set({authUser: res.data});
        } catch (error) {
            toast.error(error?.response?.data?.message || "smething went wrong");
        }
    },
    editProject: async (index,data)=>{
        try {
            const res = await axiosInstance.put(`/auth/edit/${index}`,data);
            set({authUser: res.data});
        } catch (error) {
            toast.error(error?.response?.data?.message || "smething went wrong");
        }
    },
    setProfile: (val)=>set({profile:val})

}))