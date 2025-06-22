import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
    const {messages, selectedUser, setSelectedUser, sendMessage, getMessages } =useContext(ChatContext);
    const {authUser, onlineUsers } = useContext(AuthContext);
    const scrollEnd=useRef();
    const [input , setInput]=useState('');

    //handle sending a message
    const handleSendMessage=async (e)=>{
      e.preventDefault();
      if(input.trim()==="") return null;
      await sendMessage({text: input.trim()});
      setInput("");
    }

    //handle sending an image
    const handleSendImage=async (e)=>{
      const file =e.target.files[0];
      if(!file || !file.type.startsWith("image/")){
        toast.error("select an image type");
        return;
      }
      const reader=new FileReader();
      reader.onloadend=async ()=>{
        await sendMessage({image: reader.result})
        e.target.value=""
      }
      reader.readAsDataURL(file)
    }
    useEffect(()=>{
      if(selectedUser){
        getMessages(selectedUser._id);
      }
    },[selectedUser])

    useEffect(()=>{
      if(scrollEnd.current && messages){
          scrollEnd.current.scrollIntoView({behavior: 'smooth'})
      }
    },[messages])

  return selectedUser ? (
    <div className='h-full w-full min-h-0 flex flex-col justify-between backdrop-blur-lg'>
        {/* ------header part (user info and status)--------*/}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt=""  className='w-8 rounded-full'/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'> {selectedUser.fullname} {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}</p>
        <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
        <img src={assets.help_icon} alt=""  className='max-md:hidden max-w-5'/>
      </div>
      {/*--------- chat portion ------*/}
      <div className='flex-1 flex flex-col overflow-y-auto p-3'>
        {messages.map((msg, index) => {
          const isSelf = msg.senderId._id === authUser._id;
          return (
            <div key={index} className={`w-full flex mb-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
              {/* For other user: avatar left, bubble right. For self: bubble left, avatar right */}
              {!isSelf && (
                <img src={msg.senderId.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full mr-2 self-end" />
              )}
              <div className={`flex flex-col items-${isSelf ? 'end' : 'start'} max-w-[60%]`}>
                {msg.image ? (
                  <img className='max-w-full border border-gray-700 rounded-lg overflow-hidden mb-1' src={msg.image} alt="" />
                ) : (
                  <p className={`p-2 md:text-sm font-light rounded-lg mb-1 break-all bg-violet-500/30 text-white ${isSelf ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                )}
                <span className='text-gray-500 text-xs'>{formatMessageTime(msg.createdAt)}</span>
              </div>
              {isSelf && (
                <img src={msg.senderId.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full ml-2 self-end" />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}>
        </div>
      </div>
      {/* bottom section */}
      <div className='flex items-center gap-3 p-3 bg-transparent'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input onChange={(e)=> setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key==="Enter" ? handleSendMessage(e):null} className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' type="text" name="" id="" placeholder='Send a message' />
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
          <label htmlFor="image">
            <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' alt="" />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer'/>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} alt=""  className='max-w-16'/>
        <p className='text-white text-lg font-medium'>Chat anytime, anywhere!</p>
    </div>
  )
}

export default ChatContainer;
