import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Utensils, Clock, CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { DailyMenu } from '../types';

interface CafeteriaMenuProps {
  menus: DailyMenu[];
}

export default function CafeteriaMenu({ menus }: CafeteriaMenuProps) {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  
  // mock dates for selection if menus is empty for the demo
  const displayMenus = menus.length > 0 ? menus : [
    {
      date: '2026.05.06 (오늘)',
      breakfast: '가나곡물빵, 스크램블에그, 베이컨, 시리얼, 우유, 계절과일',
      lunch: '육개장, 고등어구이, 시금치나물, 포기김치, 오이소박이, 청포도푸딩',
      dinner: '순살돈까스, 크림스프, 마카로니샐러드, 깍두기, 양상추샐러드, 요구르트',
      operatingHours: { breakfast: '07:30 - 09:00', lunch: '11:40 - 13:30', dinner: '17:30 - 19:00' }
    },
    {
      date: '2026.05.07 (내일)',
      breakfast: '콩나물국, 돈육장조림, 애호박볶음, 깍두기, 김구이',
      lunch: '마라탕, 궈바오로우, 단무지, 짜사이, 포기김치, 미니슈',
      dinner: '닭갈비덮밥, 유부국, 무쌈, 양배추코울슬로, 깍두기, 블루베리아이티',
      operatingHours: { breakfast: '07:30 - 09:00', lunch: '11:40 - 13:30', dinner: '17:30 - 19:00' }
    }
  ];

  const currentMenu = displayMenus[selectedDateIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Date Selector */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <button 
          disabled={selectedDateIndex === 0}
          onClick={() => setSelectedDateIndex(prev => prev - 1)}
          className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <CalendarIcon className="text-[#004b93]" size={20} />
          <span className="font-bold text-slate-800">{currentMenu.date}</span>
        </div>
        <button 
          disabled={selectedDateIndex === displayMenus.length - 1}
          onClick={() => setSelectedDateIndex(prev => prev + 1)}
          className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { type: 'breakfast', label: '조식', time: currentMenu.operatingHours?.breakfast || '07:30 - 09:00', content: currentMenu.breakfast, icon: Utensils, color: 'bg-blue-50 text-blue-600' },
          { type: 'lunch', label: '중식', time: currentMenu.operatingHours?.lunch || '11:40 - 13:30', content: currentMenu.lunch, icon: Utensils, color: 'bg-orange-50 text-orange-600' },
          { type: 'dinner', label: '석식', time: currentMenu.operatingHours?.dinner || '17:30 - 19:00', content: currentMenu.dinner, icon: Utensils, color: 'bg-indigo-50 text-indigo-600' }
        ].map((meal) => (
          <motion.div
            key={meal.type}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${meal.color}`}>
                <meal.icon size={24} />
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">
                {meal.label}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
              <Clock size={12} /> {meal.time}
            </div>

            <div className="flex-1">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {meal.content || '메뉴가 아직 등록되지 않았습니다.'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <div className="bg-slate-800 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-slate-900/10">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0">
          <Info size={32} />
        </div>
        <div>
          <h4 className="text-lg font-bold mb-1">식당 이용 안내</h4>
          <p className="text-sm text-white/60 leading-relaxed">
            한림대학교 학생생활관 식당은 관생 여러분의 건강을 위해 엄선된 식재료를 사용합니다. 
            알레르기 유발 물질 포함 여부는 식당 입구의 안내문을 확인해 주시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
