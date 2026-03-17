import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../store/authstore';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/posts');
      // Assume data.payload contains the array of posts
      setPosts(data.payload || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 px-2">Home</h1>
      
      <PostForm onPost={handleNewPost} />
      
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            <button 
              onClick={fetchPosts}
              className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No posts yet.</p>
            <p className="text-sm mt-2">Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
}
