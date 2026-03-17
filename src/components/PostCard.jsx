import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { api } from '../store/authstore';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const handleCardClick = (e) => {
    // Navigate only if the click wasn't on an interactive element
    if (e.target.closest('button') || e.target.closest('a')) return;
    navigate(`/post/${post._id}`, { state: { post } });
  };

  const toggleLike = async () => {
    try {
      // Optimistic UI update
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      await api.put(`/posts/${post._id}/like`);
    } catch (err) {
      // Revert on error
      setLiked(!liked);
      setLikeCount(liked ? likeCount + 1 : likeCount - 1);
      console.error('Failed to toggle like', err);
    }
  };

  const authorInitials = post.author?.username?.charAt(0).toUpperCase() || '?';
  const commentCount = post.comments?.length || 0;
  const imageUrl = post.image ? `http://localhost:4000/uploads/${post.image}` : null;

  return (
    <div 
      onClick={handleCardClick}
      className="p-5 mb-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">
            {authorInitials}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">{post.author?.username}</span>
            <span className="text-sm text-gray-500">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}</span>
          </div>
          
          <p className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200 mb-3">
            {post.content}
          </p>
          
          {imageUrl && (
            <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <img src={imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-96" />
            </div>
          )}
          
          <div className="flex items-center gap-6 mt-2 pt-2 text-gray-500">
            <button 
              onClick={toggleLike}
              className={`flex items-center gap-1.5 group transition-colors ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <button 
              className="flex items-center gap-1.5 hover:text-blue-500 transition-colors group"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/post/${post._id}`, { state: { post } });
              }}
            >
              <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">{commentCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
