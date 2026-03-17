import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, useAuthStore } from '../store/authstore';
import PostCard from '../components/PostCard';
import { Loader2, Calendar } from 'lucide-react';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/users/${username}`);
        setProfileUser(data.payload);
        setIsFollowing(currentUser?.following?.includes(data.payload._id) || false);
      } catch (err) {
        setError(err.response?.data?.message || 'User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username, currentUser?.following]);

  const handleFollowToggle = async () => {
    if (!profileUser || followLoading) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.put(`/users/${profileUser._id}/unfollow`);
      } else {
        await api.put(`/users/${profileUser._id}/follow`);
      }
      setIsFollowing(!isFollowing);
      
      // Update local follower count
      setProfileUser(prev => ({
        ...prev,
        followers: isFollowing 
          ? prev.followers.filter(id => id !== currentUser._id)
          : [...prev.followers, currentUser._id]
      }));
    } catch (err) {
      console.error('Follow toggle failed', err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
        <p className="text-gray-500">{error || "This account doesn't exist"}</p>
      </div>
    );
  }

  const isCurrentUser = profileUser._id === currentUser?._id;
  const initial = profileUser.username?.charAt(0).toUpperCase();

  return (
    <div className="w-full">
      <div className="mb-8 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm relative overflow-hidden">
        {/* Header background accent */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800"></div>
        
        <div className="relative pt-8 flex flex-col md:flex-row gap-6 md:items-end mb-6">
          <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-900 border-4 border-white dark:border-gray-900 flex items-center justify-center font-bold text-4xl text-gray-700 dark:text-gray-300 shadow-sm z-10 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              {initial}
            </div>
          </div>
          
          <div className="flex-grow flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{profileUser.username}</h1>
              <p className="text-gray-500">@{profileUser.username}</p>
            </div>
            
            {!isCurrentUser && (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  isFollowing 
                    ? 'border-2 border-gray-300 dark:border-gray-700 bg-transparent hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                    : 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
                }`}
              >
                {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
            
            {isCurrentUser && (
              <button className="px-6 py-2 rounded-full font-bold border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        {profileUser.bio && (
          <p className="mb-4 text-gray-800 dark:text-gray-200">{profileUser.bio}</p>
        )}
        
        <div className="flex gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Joined {new Date(profileUser.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
        
        <div className="flex gap-6 text-sm">
          <div className="flex gap-1.5">
            <span className="font-bold text-black dark:text-white">{profileUser.following?.length || 0}</span>
            <span className="text-gray-500">Following</span>
          </div>
          <div className="flex gap-1.5">
            <span className="font-bold text-black dark:text-white">{profileUser.followers?.length || 0}</span>
            <span className="text-gray-500">Followers</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 px-2 border-b border-gray-200 dark:border-gray-800 pb-4">Posts</h2>
      
      <div className="space-y-4">
        {profileUser.posts && profileUser.posts.length > 0 ? (
          // In some designs the user posts are populated, otherwise we would map over post IDs or fetch specifically
          // This assumes the API returns full post objects in `profileUser.posts`
          profileUser.posts.map(post => (
            <PostCard 
              key={post._id} 
              post={{
                ...post, 
                author: { _id: profileUser._id, username: profileUser.username } // Inject author if omitted
              }} 
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
