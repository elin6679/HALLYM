import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      onLoginSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-blocked') {
        setError('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('로그인 창이 닫혔습니다. 다시 시도해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#004b93] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-[#004b93]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="text-[#004b93]" size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Hallym Dorm</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          한림대학교 학생생활관 전용 플랫폼에<br/>오신 것을 환영합니다.
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 text-sm text-left"
          >
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p>{error}</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <Loader2 className="animate-spin text-[#004b93]" size={20} />
            ) : (
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            )}
            {isLoggingIn ? '로그인 진행 중...' : '구글 계정으로 시작하기'}
          </button>
          
          <p className="text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-medium">
            Hallym University Student Only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
