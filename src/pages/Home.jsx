import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { MessageSquare, Heart, Users } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to feed if already logged in
  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className="flex flex-col items-center  justify-center min-h-[70vh] text-center px-4">
      <div className="mb-8 p-4 text-white">
        <img src="./src/assets/oo.png" alt="" className='w-50'/> 
      </div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 mt-4 max-w-2xl text-white font-sans">
        Join the conversation happening right now
      </h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl">
        Verse is your go-to place for sharing thoughts, connecting with friends, and discovering what's new.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link 
          to="/register" 
          className="flex-1 py-3 px-6 rounded-full bg-black text-white dark:bg-black dark:text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          Get Started
        </Link>
        <Link 
          to="/login" 
          className="flex-1 py-3 px-6 rounded-full bg-linear-to-r from-blue-400 to-pink-500 text-white font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
          Sign In
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl text-left border-t border-gray-200 dark:border-gray-800 pt-12 text-white">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Speak Your Mind</h3>
          <p className="text-gray-400 text-sm">Share brief updates and start conversations with your followers.</p>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Engage</h3>
          <p className="text-gray-400 text-sm">Like comments and interact with posts that resonate with you.</p>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="p-3 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-2xl mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Connect</h3>
          <p className="text-gray-400 text-sm">Find friends, follow interesting people, and build your network.</p>
        </div>
      </div>
    </div>
  );
}
