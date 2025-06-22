import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const {authUser, updateProfile} = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullname || '');
  const [bio, setBio] = useState(authUser?.bio || '');

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if(!selectedImg) {
        await updateProfile({fullname: name, bio});
        toast.success('Profile updated successfully');
        navigate('/');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      
      reader.onload = async() => {
        try {
          const base64Image = reader.result;
          await updateProfile({
            profilePic: base64Image,
            fullname: name,
            bio
          });
          toast.success('Profile updated successfully');
          navigate('/');
        } catch (error) {
          toast.error(error.message || 'Failed to update profile');
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read image file');
        setIsLoading(false);
      };
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input 
              type="file" 
              id="avatar" 
              accept='image/png, image/jpeg, image/jpg' 
              hidden 
              onChange={(event) => setSelectedImg(event.target.files[0])}
            />
            <img 
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon} 
              alt="Profile" 
              className={`w-12 h-12 rounded-full object-cover`}
            />
            <span className='text-sm'>Upload profile image</span>
          </label>
          <input 
            onChange={(event) => setName(event.target.value)} 
            value={name} 
            type="text" 
            required 
            placeholder='Your name' 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' 
          />
          <textarea 
            onChange={(event) => setBio(event.target.value)} 
            value={bio} 
            required 
            placeholder='Write profile bio' 
            rows={4} 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
          />
          <button 
            className={`bg-gradient-to-r from-purple-500 to-violet-400 text-white p-2 rounded-full text-lg cursor-pointer transition-opacity ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`} 
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </form>
        <img 
          src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.logo_icon} 
          className='max-w-44 aspect-square rounded-full max-sm:mt-10 mx-10 object-cover' 
          alt="Profile Preview" 
        />
      </div>
    </div>
  );
};

export default ProfilePage;