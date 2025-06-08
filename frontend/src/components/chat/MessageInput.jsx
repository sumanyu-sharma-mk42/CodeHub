import React, {useRef, useState } from 'react'
import useChatStore from '../../store/useChatStore'
import { Code, Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCodeStore } from '../../store/useCodeStore';

function MessageInput() {
  const  {sendingMessage} = useChatStore();
  const {createCode, session} = useCodeStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e)=>{
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")){
        toast.error("please select an image");
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async ()=>{
        setImage(reader.result); // this is image in base64
    }
  }

  const removeImage = ()=>{
    setImage(null);
    if(fileInputRef.current) fileInputRef.current.value = ""; 
    //Setting .value = "" clears the file input, so even if the user selects the same file again later, it will still trigger the onChange event.
  }

  const handleSendMessage = async (e)=>{
    e.preventDefault();
    await sendingMessage({text:text.trim(), image:image});
    setText("");
    setImage(null);
    if(fileInputRef.current) fileInputRef.current.value = ""; 
  }

  const handleCode = async (e)=>{
    e.preventDefault();
    
    const newsession = await createCode();
    const id = newsession.sessionID;
    await sendingMessage({text:"", image:null, code: id});
  }

  return (
    <div className="p-4 border-t border-[#30363d] bg-[#161b22]">
      {image && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-[#30363d]"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0d1117] text-[#8b949e] hover:text-white flex items-center justify-center hover:bg-[#1f2428] transition-colors"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 mx-5">
        <div className="flex-1 flex gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            type="button"
            className={`hidden sm:flex p-2 rounded-lg transition-colors ${
              image ? "text-[#238636]" : "text-[#8b949e] hover:text-white"
            } hover:bg-[#1f2428]`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          <button
            type="button"
            className="hidden sm:flex p-2 rounded-lg transition-colors text-[#8b949e] hover:text-white hover:bg-[#1f2428]"
            onClick={handleCode}
          >
            <Code size={20} />
          </button>

          <input
            type="text"
            className="flex-1 bg-[#0d1117] text-white border border-[#30363d] rounded-lg px-4 py-2 focus:outline-none focus:border-[#238636] font-mono"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text.trim() && !image}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput