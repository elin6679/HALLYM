import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { WashingMachine, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LaundryMachine } from '../types';
import { formatDistanceToNow, addMinutes, isAfter } from 'date-fns';
import { ko } from 'date-fns/locale';

interface LaundryRoomProps {
  machines: LaundryMachine[];
  onUpdateMachine: (machineId: string, updates: Partial<LaundryMachine>) => void;
  currentUserId: string;
}

export default function LaundryRoom({ machines, onUpdateMachine, currentUserId }: LaundryRoomProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000); // 10초마다 갱신
    return () => clearInterval(timer);
  }, []);

  const handleStartMachine = (machine: LaundryMachine) => {
    if (machine.status !== 'available') return;
    
    // 기본적으로 세탁 40분, 건조 50분으로 설정
    const duration = machine.type === 'washer' ? 40 : 50;
    
    onUpdateMachine(machine.id, {
      status: 'in-use',
      userId: currentUserId,
      startTime: new Date(),
      durationMinutes: duration
    });
  };

  const handleStopMachine = (machine: LaundryMachine) => {
    if (machine.status !== 'in-use' || machine.userId !== currentUserId) return;
    
    onUpdateMachine(machine.id, {
      status: 'available',
      userId: undefined,
      startTime: undefined,
      durationMinutes: undefined
    });
  };

  const getRemainingTime = (machine: LaundryMachine) => {
    if (!machine.startTime || !machine.durationMinutes) return null;
    const endTime = addMinutes(new Date(machine.startTime), machine.durationMinutes);
    if (isAfter(now, endTime)) return '완료';
    return formatDistanceToNow(endTime, { locale: ko, addSuffix: true }) + ' 종료';
  };

  const getProgress = (machine: LaundryMachine) => {
    if (!machine.startTime || !machine.durationMinutes) return 0;
    const start = new Date(machine.startTime).getTime();
    const end = addMinutes(new Date(machine.startTime), machine.durationMinutes).getTime();
    const current = now.getTime();
    const progress = ((current - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-[#004b93] mb-2 flex items-center gap-2">
          <AlertCircle size={20} /> 실시간 세탁실 안내
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>세탁 완료 후 다른 관생을 위해 바로 수거해 주세요.</li>
          <li>세탁 시 액체 세제 사용을 권장합니다.</li>
          <li>분실 방지를 위해 가급적 종료 시간에 맞춰 방문해 주세요.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {machines.map((machine) => {
          const isUserMachine = machine.userId === currentUserId;
          const remaining = getRemainingTime(machine);
          const progress = getProgress(machine);

          return (
            <motion.div
              key={machine.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all ${
                isUserMachine ? 'border-blue-500 shadow-blue-100' : 'border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  machine.status === 'available' ? 'bg-green-50 text-green-600' : 
                  machine.status === 'in-use' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                }`}>
                  <WashingMachine size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {machine.type === 'washer' ? 'Washer' : 'Dryer'} {machine.machineIndex}
                  </p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    machine.status === 'available' ? 'bg-green-100 text-green-700' : 
                    machine.status === 'in-use' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {machine.status === 'available' ? '대기중' : 
                     machine.status === 'in-use' ? '사용중' : '점검중'}
                  </span>
                </div>
              </div>

              {machine.status === 'in-use' && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {remaining}
                    </p>
                    <span className="text-xs font-bold text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              )}

              {machine.status === 'available' ? (
                <button
                  onClick={() => handleStartMachine(machine)}
                  className="w-full py-3 rounded-2xl bg-slate-50 text-slate-700 font-bold hover:bg-[#004b93] hover:text-white transition-all active:scale-[0.98]"
                >
                  시작하기
                </button>
              ) : isUserMachine ? (
                <button
                  onClick={() => handleStopMachine(machine)}
                  className="w-full py-3 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]"
                >
                  사용 종료
                </button>
              ) : (
                <div className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 font-bold text-center">
                  사용불가
                </div>
              )}
              
              {isUserMachine && (
                <p className="text-[10px] text-center text-blue-500 font-bold mt-3">내가 사용하고 있는 기기입니다</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
