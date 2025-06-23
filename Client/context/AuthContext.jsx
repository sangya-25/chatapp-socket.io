import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendurl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendurl;

// Always attach token from localStorage to every request
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.token = token;
    }
    return config;
});

export const AuthContext=createContext();

export const AuthProvider=({children})=>{

    const [token, setToken]=useState(localStorage.getItem("token"));
    const [authUser, setAuthUser]=useState(null);
    const [onlineUser, setOnlineUser]=useState([]);
    const [socket, setSocket]=useState(null);
    const [loading, setLoading] = useState(true);

    //check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth=async ()=>{
        let authSuccess = false;
        try{
            const {data} = await axios.get("/api/user/check");
            if (data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
                authSuccess = true;
            } else {
                setAuthUser(null);
            }
        }catch(error){
            setAuthUser(null);
        } finally {
            // Ensure preloader is visible for at least 3 seconds
            setTimeout(() => setLoading(false), 3000);
        }
    }

    //Login function to handle user authenctication and socket connection
    const login = async (state, credentials)=>{
        try{
            const {data}=await axios.post(`/api/user/${state}`,credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"]=data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    //logout function to handle user logout and socket disconnection
    const logout= async () =>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        axios.defaults.headers.common["token"]=null;
        toast.success("Logged out successfully");
        socket.disconnect();
    }
    //update profile function to handle user profile updates
    const updateProfile = async (body)=>{
        try{
            const {data} = await axios.put("/api/user/update-profile",body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully")
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    //connect socket function to handle socket connection and online users updates
    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendurl, {
            query:{
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUser(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"]=token;
        }
        checkAuth()
    },[])

    const value={
        axios,
        authUser,
        onlineUser,
        onlineUsers: onlineUser,
        socket,
        login,
        logout,
        updateProfile,
        loading,
    }
    return(
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center min-h-screen w-full z-50" style={{background: `url('/bgImage.svg') center/cover no-repeat`, filter: 'blur(0px)'}}>
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-white text-xl font-semibold drop-shadow-lg">Loading...</span>
                  </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    )
}