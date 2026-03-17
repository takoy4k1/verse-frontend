import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuthStore } from '../store/authstore';

export default function UserCard({ user }) {
  const currentUser = useAuthStore(state => state.user);
  const isCurrentUser = currentUser?._id === user._id;
  const initialFollowing = currentUser?.following?.includes(user._id) || false;
  
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async (e) => {
    e.preventDefault();
    if (isCurrentUser || loading) return;
    
    setLoading(true);
    try {
      if (isFollowing) {
        await api.put(`/users/${user._id}/unfollow`);
      } else {
        await api.put(`/users/${user._id}/follow`);
      }
      setIsFollowing(!isFollowing);
      // In a real app we'd also update the current user's following list in Zustand store
    } catch (err) {
      console.error('Follow toggle failed', err);
    } finally {
      setLoading(false);
    }
  };

  const initial = user.username?.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex items-center justify-between p-4 mb-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <Link to={`/profile/${user.username}`} className="flex items-center gap-4 flex-grow">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 flex-shrink-0">
          {initial}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{user.username}</h3>
          {(user.bio || user.email) && (
            <p className="text-sm text-gray-500 line-clamp-1">{user.bio || user.email}</p>
          )}
        </div>
      </Link>
      
      {!isCurrentUser && (
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`px-4 py-1.5 ml-4 rounded-full font-medium text-sm transition-colors border ${
            isFollowing 
              ? 'border-gray-300 dark:border-gray-600 bg-transparent text-black dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
              : 'border-transparent bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
          }`}
        >
          {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
}
