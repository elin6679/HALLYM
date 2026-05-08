import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  WashingMachine, 
  Utensils, 
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, LaundryMachine, DailyMenu, Announcement } from '../types';

interface DashboardProps {
  user: UserProfile;
  laundryStatus: LaundryMachine[];
  nextMenu: DailyMenu | null;
  announcements: Announcement[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ user, laundryStatus, nextMenu, announcements, onNavigate }: DashboardProps) {
  const washersAvailable = laundryStatus.filter(m => m.type === 'washer' && m.status === 'available').length;
  const dryersAvailable = laundryStatus.filter(m => m.type === 'dryer' && m.status === 'available').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Profile Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="md:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden"
      >
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-slate-800 mb-1">반갑습니다, {user.name}님! 👋</h3>
          <p className="text-slate-500 mb-6">{user.dormRoom} | 학번: {user.studentId}</p>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 flex-1 min-w-[150px]">
              <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-blue-500" /> 누적 상점
              </p>
              <p className="text-2xl font-bold text-blue-600">12점</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 flex-1 min-w-[150px]">
              <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                <TrendingDown size={12} className="text-red-500" /> 누적 벌점
              </p>
              <p className="text-2xl font-bold text-red-600">2점</p>
            </div>
            <div className="bg-[#004b93] text-white rounded-2xl p-4 flex-1 min-w-[150px] shadow-lg shadow-[#004b93]/20">
              <p className="text-xs text-white/60 font-medium mb-1">총 상벌점</p>
              <p className="text-2xl font-bold">10점</p>
            </div>
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </motion.div>

      {/* Quick Action Widget - Laundry */}
      <motion.div 
        whileHover={{ y: -5 }}
        onClick={() => onNavigate('laundry')}
        className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <WashingMachine size={24} />
          </div>
          <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-4">실시간 세탁실</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">세탁기 (3대)</span>
            <span className={`font-bold ${washersAvailable > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {washersAvailable}대 사용가능
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(washersAvailable / 3) * 100}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-sm mt-4">
            <span className="text-slate-500">건조기 (1대)</span>
            <span className={`font-bold ${dryersAvailable > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {dryersAvailable > 0 ? '사용가능' : '사용중'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${dryersAvailable * 100}%` }}></div>
          </div>
        </div>
      </motion.div>

      {/* Menu Widget */}
      <motion.div 
        whileHover={{ y: -5 }}
        onClick={() => onNavigate('menu')}
        className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <Utensils size={24} />
          </div>
          <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold uppercase">TODAY</span>
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-2">오늘의 식단</h4>
        <div className="bg-orange-50/50 rounded-2xl p-4">
          <p className="text-xs text-orange-600 font-bold mb-2 flex items-center gap-2">
            <Clock size={12} /> 중식 (12:00 ~ 13:30)
          </p>
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {nextMenu?.lunch || '메뉴 정보가 없습니다.'}
          </p>
        </div>
      </motion.div>

      {/* Notice Feed */}
      <div className="md:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-slate-800">긴급 공지사항</h4>
          <button className="text-sm text-[#004b93] font-semibold hover:underline">전체보기</button>
        </div>
        <div className="space-y-4">
          {announcements.length > 0 ? announcements.map((notice) => (
            <div key={notice.id} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                notice.importance === 'urgent' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
              }`}>
                {notice.importance === 'urgent' ? <AlertTriangle size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">{notice.title}</h5>
                <p className="text-xs text-slate-500 line-clamp-1">{notice.content}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">최근 공지사항이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
