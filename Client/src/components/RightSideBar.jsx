import React, { useContext } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/chatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSideBar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout } = useContext(AuthContext);
  // Get all images sent in the chat with the selected user
  const mediaMessages = messages.filter(msg => msg.image);
  return selectedUser &&(

    // user's profile info   //
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser? "max-md:hidden": ""}`}>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""  className='w-20 aspect-[1/1] rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <p className='w-2 h-2 rounded-full bg-green-500'></p>
          {selectedUser.fullname}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

      {/* Media section */}

      <hr className='border-[#ffffff50] my-4'/>
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {mediaMessages.length > 0 ? mediaMessages.map((msg, index) => (
            <div key={index} onClick={()=> window.open(msg.image)} className='cursor-pointer rounded'>
              <img src={msg.image} className='h-full rounded-md' alt="" />
            </div>
          )) : <p className='col-span-2 text-center text-gray-400'>No media yet</p>}
        </div>
      </div>

      {/* logout button */}
      <button onClick={logout} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-gray-800 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
        Logout
      </button>
    </div>
  )
}

export default RightSideBar
