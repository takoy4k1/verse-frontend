import { useState, useRef } from 'react';
import { Image, X } from 'lucide-react';
import { api } from '../store/authstore';

export default function PostForm({ onPost }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setContent('');
      removeImage();
      if (onPost) onPost(data.payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {error && <div className="mb-3 text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>}
      
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 flex-shrink-0">
          {/* Using a generic icon or could connect to useAuthStore to show current user initials */}
          You
        </div>
        
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's going on?"
            maxLength={280}
            className="w-full bg-transparent resize-none border-none outline-none text-lg min-h-[80px] text-black dark:text-white placeholder-gray-500"
          />
          
          {imagePreview && (
            <div className="relative mb-4 inline-block">
              <img src={imagePreview} alt="Preview" className="max-w-full h-auto max-h-64 rounded-xl object-cover border border-gray-100 dark:border-gray-800" />
              <button 
                type="button" 
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-blue-500"
              >
                <Image className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              <span className={`text-xs ${content.length > 250 ? 'text-orange-500' : 'text-gray-400'}`}>
                {content.length > 0 && `${content.length}/280`}
              </span>
            </div>
            
            <button
              type="submit"
              disabled={loading || (!content.trim() && !image)}
              className="px-6 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold disabled:opacity-50 transition-opacity"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
