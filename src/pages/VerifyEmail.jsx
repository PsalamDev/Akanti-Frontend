import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

export default function VerifyEmail() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const initialCode = location.state?.code || '';

  useEffect(() => {
    if (initialCode && initialCode.length === 6) {
      const digits = initialCode.split('');
      setCode(digits);
      inputRefs.current[5]?.focus();
    }
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newCode.every(c => c) && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newCode = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
      setCode(newCode);
      const nextEmpty = newCode.findIndex(c => !c);
      inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
      if (pasted.length === 6) handleVerify(pasted);
    }
  };

  const handleVerify = async (codeStr) => {
    setLoading(true);
    try {
      await authAPI.verifyEmail({ email, code: codeStr || code.join('') });
      toast.success('Email verified! You can now sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authAPI.resendCode({ email });
      toast.success('New code sent!');
      setResendCooldown(60);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl"><Mail className="text-green-600" size={32} /></span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Enter the 6-digit code sent to<br /><span className="font-medium text-gray-700 dark:text-gray-300">{email || 'your email'}</span></p>
          </div>

          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input key={i} ref={el => inputRefs.current[i] = el} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} className="w-12 h-14 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            ))}
          </div>

          <button onClick={() => handleVerify()} disabled={loading || code.some(c => !c)} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 mb-4">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="text-center">
            {resendCooldown > 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Resend code in {resendCooldown}s</p>
            ) : (
              <button onClick={handleResend} className="text-green-600 hover:text-green-700 dark:text-green-400 text-sm font-medium">Resend Code</button>
            )}
          </div>

          <p className="text-center mt-6">
            <Link to="/login" className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
