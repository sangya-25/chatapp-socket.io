import React, { useContext } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import { ChatContext } from '../../context/chatContext'

const HomePage = () => {
    const { selectedUser } = useContext(ChatContext);

  return (
    <div className='min-h-screen h-screen w-full'>
      <div className={`grid grid-cols-1 h-full min-h-0 w-full overflow-hidden relative 
      ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <SideBar />
        <ChatContainer />
        <RightSideBar />
      </div>
    </div>
  )
}

export default HomePage
