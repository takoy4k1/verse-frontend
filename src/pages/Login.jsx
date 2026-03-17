import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate('/feed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] ">
    <div className="w-full max-w-md p-8 lg:p-10 rounded-3xl border border-red-900/30 bg-linear-to-br from-black via-black to-gray-800 shadow-2xl"> 
        <h1 className="text-3xl text-white font-bold mb-2 text-center">Welcome back</h1>
        <p className="text-center text-gray-300 mb-8 text-sm">Log in to Verse to see what's happening</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 font-medium mb-1.5 ml-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border  text-gray-200  border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow"
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm  text-gray-200 font-medium mb-1.5 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border text-gray-200  border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 rounded-full bg-linear-to-r from-blue-400 to-pink-500 bg-black text-white dark:bg-white dark:text-black font-bold text-lg hover:opacity-90 disabled:opacity-70 transition-opacity"
          > 
          
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-pink-700 dark:text-blue-400 font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
