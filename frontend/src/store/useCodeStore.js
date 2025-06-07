import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import useChatStore from './useChatStore.js';
import { useAuthStore } from './useAuthStore.js';


export const useCodeStore = create((set,get)=>({
    session: null,
    isSaving: false,
    isLoading: false,
    roomUsers: [],

    createCode: async ()=>{
        try {
            const selectedid = useChatStore.getState().selectedUser;
            if(!selectedid) return toast.error("no user selected");
            console.log(selectedid);
            const res = await axiosInstance.post(`/code/create/${selectedid._id}`);
            set({session: res.data});
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    saveChange: async ()=>{
        set({isSaving: true});
        const socket = useAuthStore.getState().socket;
        try {
            if(!get().session) return toast.error("error occured while saving");
            const sessionid = get().session.sessionID;
            socket.emit("code_save",get().session,true);

            const res = await axiosInstance.put(`/code/saving/${sessionid}`,get().session);
            set({session: res.data});

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSaving: false});
            socket.emit("code_save",get().session,false);
        }
    },
    getCode: async (sessionId)=>{
        set({isLoading: true});
        try {
            if(!sessionId) return toast.error("invalid session");
            const res = await axiosInstance.get(`/code/getsession/${sessionId}`);
            set({session: res.data});

            const socket = useAuthStore.getState().socket;
            const user = useAuthStore.getState().authUser;

            socket.on("onlineuser",(users)=>{  
                set({roomUsers:users});
            })
            console.log(user)
            socket.emit("join_room",sessionId,user);  // emits to join the room to the server

            socket.on("code_change",(data)=>{  // listens for any change from the server that may be done by some other client
                set({session:data});
            })

            socket.on("code_save",(issaving)=>{  // listens from the serve if some other client saved the program
                set({isSaving:issaving});
            })


        } catch (error) {
            toast.error("no error");
        }finally{
            set({isLoading: false});
        }
    },
    updateCodeRealTime: ()=>{
        if(!get().session || !get().session.sessionID) return;
        const socket = useAuthStore.getState().socket;
        if(socket){
            socket.emit("code_change",get().session); // sends it to the server for updating the code at other clients
        }
    },
    setSession: (data)=>set({session:data}),

    closeSession: ()=>{
        const socket = useAuthStore.getState().socket;
        const user = useAuthStore.getState().authUser;
        if(socket){
            socket.emit("editorUserLeft",get().session.sessionID,user);
            socket.off("onlineuser");
            socket.off("code_change");
            socket.off("code_save");
            set({session: null,roomUsers: []});
        }
    },
}))