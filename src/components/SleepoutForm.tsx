import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Moon, MessageCircle, Send, CheckCircle2, History } from 'lucide-react';
import { SleepoutApplication } from '../types';

interface SleepoutFormProps {
  applications: SleepoutApplication[];
  onSubmit: (app: Partial<SleepoutApplication>) => void;
}

export default function SleepoutForm({ applications, onSubmit }: SleepoutFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;
    
    onSubmit({
      startDate,
      endDate,
      reason,
      status: 'pending',
      createdAt: new Date(),
    });
    
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Application Form */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#004b93]">
            <Moon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">외박 신청</h3>
            <p className="text-xs text-slate-400 font-medium">당일 21:00까지 신청 필수</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">시작일</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">종료일</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">사유</label>
            <div className="relative">
              <MessageCircle className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea 
                rows={4}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="간략하게 사유를 입력하세요 (예: 본가 방문)"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm resize-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitted}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#004b93]/10 active:scale-[0.98] ${
              isSubmitted ? 'bg-green-500 text-white' : 'bg-[#004b93] text-white hover:bg-[#003c78]'
            }`}
          >
            {isSubmitted ? (
              <><CheckCircle2 size={20} /> 신청 완료</>
            ) : (
              <><Send size={18} /> 신청하기</>
            )}
          </button>
        </form>
      </div>

      {/* Application History */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-fit">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <History size={20} className="text-[#004b93]" /> 최근 신청 내역
          </h3>
          <span className="text-xs text-slate-400 font-bold">{applications.length}건</span>
        </div>

        <div className="space-y-4">
          {applications.length > 0 ? applications.map((app) => (
            <div key={app.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                  app.status === 'approved' ? 'bg-green-100 text-green-700' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {app.status === 'approved' ? '승인' : app.status === 'rejected' ? '반려' : '대기'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(app.createdAt?.seconds * 1000 || app.createdAt).toLocaleDateString()} 신청
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">{app.startDate} ~ {app.endDate}</p>
              <p className="text-xs text-slate-500 font-medium">{app.reason}</p>
            </div>
          )) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">신청 내역이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
