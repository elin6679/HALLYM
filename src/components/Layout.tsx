import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  ShieldAlert, 
  FileText, 
  Moon, 
  Utensils, 
  WashingMachine, 
  Users, 
  LogOut,
  Bell
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: UserRole;
  userName?: string;
  onLogout: () => void;
}

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  userRole, 
  userName,
  onLogout 
}: LayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: '홈', icon: Home },
    { id: 'complaints', label: '민원 신청', icon: ShieldAlert },
    { id: 'points', label: '상벌점 조회', icon: FileText },
    { id: 'sleepout', label: '외박 신청', icon: Moon },
    { id: 'menu', label: '오늘의 메뉴', icon: Utensils },
    { id: 'laundry', label: '세탁실 현황', icon: WashingMachine },
    { id: 'community', label: '커뮤니티', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-[#004b93] text-white flex-col sticky top-0 h-screen shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">Hallym Dorm</h1>
          <p className="text-xs text-white/60 mt-1">학생생활관 통합 플랫폼</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-white text-[#004b93] shadow-lg font-bold' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#003c78]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {userName?.[0] || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{userName || '사용자'}</p>
              <p className="text-xs text-white/50 truncate uppercase">{userRole || 'STUDENT'}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-xs hover:bg-white/10 transition-colors"
          >
            <LogOut size={14} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Mobile Header / Nav */}
      <header className="md:hidden bg-[#004b93] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <h1 className="font-bold">Hallym Dorm</h1>
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button onClick={onLogout}><LogOut size={20} /></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex bg-white h-16 border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-lg font-semibold text-slate-800">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-[#004b93] transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="text-right">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{userRole}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden bg-white border-t border-slate-200 grid grid-cols-4 px-2 py-1 sticky bottom-0 z-50">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 transition-colors ${
                activeTab === item.id ? 'text-[#004b93]' : 'text-slate-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          ))}
          <button
              onClick={() => setActiveTab('community')}
              className={`flex flex-col items-center justify-center py-2 transition-colors ${
                activeTab === 'community' ? 'text-[#004b93]' : 'text-slate-400'
              }`}
            >
              <Users size={20} />
              <span className="text-[10px] mt-1 font-medium">커뮤니티</span>
            </button>
        </nav>
      </main>
    </div>
  );
}
