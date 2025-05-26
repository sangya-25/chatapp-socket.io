import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import assets from '../assets/assets';

const ProfilePage = () => {
  const [selectedImg, setSelectedImg]=useState(null)
  const navigate=useNavigate();
  const [name, setName]=useState("Martin Johnson")
  const [bio, setBio]=useState("Hi everyone, I'm using QuickChat")

  const handleSubmit = async(e)=>{
    e.preventDefault()
    navigate('/')
  }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-revrse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1' >
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden className='' onChange={(event)=>setSelectedImg(event.target.files[0])}/>
            <img src={selectedImg? URL.createObjectURL(selectedImg): assets.avatar_icon} alt=""  className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
            Upload profile image
          </label>
          <input onChange={(event)=> setName(event.target.value)} value={name} type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
          <textarea onChange={(event)=> setBio(event.target.value)} value={bio} required placeholder='write profile bio' rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'></textarea>
          <button className='bg-gradient-to-r from-purple-500 to-violet-400 text-white p-2 rounded-full text-lg cursor-pointer' type='submit'>Save</button>
        </form>
        <img src={assets.logo_icon} className='max-w-44 aspect-square rounded-full max-sm:mt-10 mx-10' alt="" />
      </div>
    </div>
  )
}

export default ProfilePage
