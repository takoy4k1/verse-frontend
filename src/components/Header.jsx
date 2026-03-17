import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { LogOut, User, Search, Home } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 bg-gray-900 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex bg-gray-900 items-center justify-between">
        <Link to={user ? '/feed' : '/'} className="flex items-center gap-2 text-xl font-bold tracking-tight text-black dark:text-white">
          <img src="./src/assets/oo.png" alt="" className="w-15" />
          <span className='text-4xl '>Verse</span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/search" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Link>
              <Link to="/feed" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Home className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Link>
              <Link to={`/profile/${user.username}`} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Link>
              <button onClick={logout} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-white font-medium">
                Log In
              </Link>
              <Link to="/register" className="px-4 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity text-sm font-medium">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
