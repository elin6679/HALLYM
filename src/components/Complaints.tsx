import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Plus, Camera, Send, CheckCircle2, Search, Clock, ChevronRight } from 'lucide-react';
import { Complaint } from '../types';

interface ComplaintsProps {
  complaints: Complaint[];
  onSubmit: (c: Partial<Complaint>) => void;
}

export default function Complaints({ complaints, onSubmit }: ComplaintsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSubmit = () => {
    if (!formData.title || !formData.description) return;
    onSubmit({
      ...formData,
      status: 'pending',
      createdAt: new Date()
    });
    setFormData({ title: '', description: '' });
    setIsModalOpen(false);
  };

  const statusStyles = {
    'pending': 'bg-orange-100 text-orange-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'completed': 'bg-green-100 text-green-700'
  };

  const statusLabels = {
    'pending': '접수대기',
    'in-progress': '처리중',
    'completed': '처리완료'
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="내가 작성한 민원 검색..." 
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#004b93]/20"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#004b93] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/10 hover:translate-y-[-2px] transition-all"
        >
          <Plus size={20} />
          민원 신청하기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.length > 0 ? complaints.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-[#004b93]/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusStyles[item.status]}`}>
                  {statusLabels[item.status]}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(item.createdAt?.seconds * 1000 || item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2 truncate">{item.title}</h4>
              <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6">{item.description}</p>
            </div>
            
            <button className="flex items-center justify-between w-full py-3 px-4 bg-slate-50 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-100 transition-colors group">
              상세보기
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <ShieldAlert size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-400">등록된 민원이 없습니다.</h4>
            <p className="text-sm text-slate-300">시설 보수 등 불편사항이 있다면 민원을 신청해 주세요.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-8">민원 접수</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">제목</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="민원 제목을 입력하세요"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#004b93]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">상세 사유</label>
                  <textarea 
                    rows={5}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="불편 사항을 상세히 기재해 주세요"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#004b93]/20 outline-none resize-none"
                  />
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">
                    <Camera size={20} />
                    사진 첨부
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="flex-[2] flex items-center justify-center gap-2 bg-[#004b93] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                  >
                    <Send size={18} />
                    접수하기
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
