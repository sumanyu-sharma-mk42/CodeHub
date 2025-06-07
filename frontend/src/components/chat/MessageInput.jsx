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
    <div className="p-4 w-full">
      {image && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${image ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle text-zinc-400`}
            onClick={handleCode}
          >
            <Code size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !image} // if no input text or image then disabled
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput