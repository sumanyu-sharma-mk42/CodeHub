import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import { useAuthStore } from './useAuthStore.js';

const useChatStore = create((set,get)=>({
    messages: [],
    users: [],
    selectedUser: null,
    isLoadingMessages: false,
    isLoadingUsers: false,
    isSearching: false,

    getUsers: async ()=>{
        set({isLoadingUsers: true});
        try {
            const res = await axiosInstance.get("/message/users");
            set({users: res.data});

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoadingUsers: false});
        }
    },

    getMessages: async (userID)=>{
        set({isLoadingMessages: true});
        try {
            const res = await axiosInstance.get(`/message/${userID}`);
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoadingMessages: false});
        }
        
    },
    
    sendingMessage: async(data)=>{
        const {messages, selectedUser} = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,data);
            set({messages: [...messages,res.data]});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    setSelectedUser: (selectedUser)=>set({selectedUser}),

    subscribeToMessage: ()=>{
        if(!get().selectedUser) return;
        const socket = useAuthStore.getState().socket;
        socket.on("newmessage",(newMessage)=>{
            if(newMessage.senderID==get().selectedUser._id) set({messages: [...get().messages, newMessage]});
        })
    }, // see the issue that was there and the learnings from the notion
    
    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newmessage");
    },

    searchBar: async (query, type)=>{
        set({isSearching: true});
        try {
            if(!query) return "";
            const res = await axiosInstance.get("/message/search/your_query?query="+query.toLowerCase()+"&type="+type);
            return res.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "something went wrong");
        }finally{
            set({isSearching: false});
        }
    }

}))

export default useChatStore;