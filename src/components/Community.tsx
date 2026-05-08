import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  ShoppingBag, 
  Plus, 
  Search, 
  Clock, 
  User, 
  MoreVertical,
  ThumbsUp,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { Post, Comment } from '../types';

interface CommunityProps {
  posts: Post[];
  onCreatePost: (p: Partial<Post>) => void;
  onAddComment: (postId: string, content: string) => void;
  currentUserId: string;
  userName: string;
}

export default function Community({ posts, onCreatePost, onAddComment, currentUserId, userName }: CommunityProps) {
  const [activeCategory, setActiveCategory] = useState<'anonymous' | 'market'>('anonymous');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', price: 0 });

  const filteredPosts = posts.filter(p => p.category === activeCategory);

  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.content) return;
    onCreatePost({
      ...newPost,
      category: activeCategory,
      authorId: currentUserId,
      createdAt: new Date(),
    });
    setNewPost({ title: '', content: '', price: 0 });
    setIsWriteModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Category Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 mb-8 sticky top-20 z-30">
        <button
          onClick={() => setActiveCategory('anonymous')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            activeCategory === 'anonymous' ? 'bg-[#004b93] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <MessageSquare size={18} />
          자유게시판
        </button>
        <button
          onClick={() => setActiveCategory('market')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            activeCategory === 'market' ? 'bg-[#004b93] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag size={18} />
          중고장터
        </button>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="검색어를 입력하세요..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#004b93]/20 focus:border-[#004b93] outline-none transition-all shadow-sm text-sm"
          />
        </div>
        <button 
          onClick={() => setIsWriteModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#004b93] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#004b93]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          글쓰기
        </button>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-[#004b93]/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {post.category === 'anonymous' ? '익명' : post.authorName || '작성자'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(post.createdAt?.seconds * 1000 || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#004b93] transition-colors">{post.title}</h4>
            <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
              {post.content}
            </p>

            {post.category === 'market' && post.price !== undefined && (
              <div className="mb-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl font-bold text-sm">
                <Tag size={14} />
                {post.price.toLocaleString()}원
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
              <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors text-xs font-semibold">
                <ThumbsUp size={16} />
                좋아요 12
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-[#004b93] transition-colors text-xs font-semibold">
                <MessageSquare size={16} />
                댓글 {post.commentCount || 0}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Write Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 font-sans">
                {activeCategory === 'anonymous' ? '자유게시판' : '중고장터'} 글쓰기
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">제목</label>
                  <input 
                    type="text" 
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    placeholder="제목을 입력하세요" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#004b93]/20 focus:border-[#004b93] outline-none transition-all"
                  />
                </div>

                {activeCategory === 'market' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">가격</label>
                    <input 
                      type="number" 
                      value={newPost.price}
                      onChange={e => setNewPost({...newPost, price: Number(e.target.value)})}
                      placeholder="판매 가격을 입력하세요" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#004b93]/20 focus:border-[#004b93] outline-none transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">내용</label>
                  <textarea 
                    rows={6}
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                    placeholder="내용을 입력하세요" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#004b93]/20 focus:border-[#004b93] outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
                    <ImageIcon size={20} />
                    사진 첨부
                  </button>
                  <button 
                    onClick={handleSubmitPost}
                    className="flex-[2] bg-[#004b93] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#004b93]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    등록 완료
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
