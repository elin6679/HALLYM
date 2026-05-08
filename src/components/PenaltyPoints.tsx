import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, ClipboardList, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PenaltyPointRecord } from '../types';

interface PenaltyPointsProps {
  records: PenaltyPointRecord[];
  totalPoints: number;
}

export default function PenaltyPoints({ records, totalPoints }: PenaltyPointsProps) {
  const meritPoints = records.filter(r => r.points > 0).reduce((acc, r) => acc + r.points, 0);
  const demeritPoints = Math.abs(records.filter(r => r.points < 0).reduce((acc, r) => acc + r.points, 0));

  // Mock data for chart
  const chartData = [
    { month: '1월', points: 2 },
    { month: '2월', points: -1 },
    { month: '3월', points: 5 },
    { month: '4월', points: 3 },
    { month: '5월', points: totalPoints },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
            <TrendingUp size={24} />
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">누적 상점</p>
          <p className="text-3xl font-black text-blue-600">{meritPoints}점</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
            <TrendingDown size={24} />
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">누적 벌점</p>
          <p className="text-3xl font-black text-red-600">{demeritPoints}점</p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-[#004b93] rounded-3xl p-8 shadow-xl shadow-blue-900/20 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <ClipboardList size={24} />
          </div>
          <p className="text-xs text-white/60 font-bold uppercase tracking-widest mb-1">현재 합계</p>
          <p className="text-3xl font-black">{totalPoints}점</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart View */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-8">상벌점 변동 추이</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="points" radius={[8, 8, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.points >= 0 ? '#3b82f6' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List View */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 font-sans">상세 내역</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {records.length > 0 ? records.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 mb-1">{record.reason}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(record.date?.seconds * 1000 || record.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-lg font-black ${record.points >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {record.points >= 0 ? `+${record.points}` : record.points}
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">기록이 없습니다.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-start gap-3">
            <AlertCircle className="text-yellow-600 shrink-0" size={18} />
            <p className="text-[11px] text-yellow-700 leading-relaxed font-medium">
              벌점 15점 이상 시 퇴사 조치될 수 있으며, 다음 학기 선발에 불이익이 있을 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
