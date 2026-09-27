import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { FaEnvelope, FaLock, FaBriefcase, FaRocket, FaShieldAlt, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure('Please enter both your email and password.'));
      return;
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message || 'Invalid credentials'));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotMsg('');
    setForgotErr('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to send reset link');
      }
      setForgotMsg(data.message || 'Reset link sent! Please check your inbox.');
    } catch (err) {
      setForgotErr(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 animate-gradient-shift">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col justify-center items-start px-16 text-white">
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Welcome back to<br />
              <span className="text-yellow-300">JobHub</span>
            </h1>
            <p className="mt-4 text-lg text-cyan-100 max-w-md leading-relaxed">
              Your AI-powered career launchpad. Land dream roles and sharpen your interview skills.
            </p>
          </div>

          <div className="space-y-4 stagger-children">
            {[
              { icon: <FaRocket />, text: "AI-Powered Technical Mock Interviews" },
              { icon: <FaBriefcase />, text: "Single-Pass ATS Resume Audits" },
              { icon: <FaShieldAlt />, text: "Verified Direct Recruiter Vacancies" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-xl px-5 py-3">
                <div className="text-yellow-300 text-base">{item.icon}</div>
                <span className="text-sm font-medium text-cyan-50">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Sign-in Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-[#0b1120]">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-extrabold">
              <span className="text-slate-800 dark:text-white">Job</span>
              <span className="gradient-text">Hub</span>
            </h2>
          </div>

          <div className="card-premium p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input-premium pl-11 text-xs py-3"
                    id="email"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => { setShowForgotModal(true); setForgotMsg(''); setForgotErr(''); }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-premium pl-11 text-xs py-3"
                    id="password"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="btn-gradient w-full py-3.5 mt-2 rounded-xl text-xs uppercase tracking-wider font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/sign-up" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-center">
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="card-premium bg-slate-900 border-slate-700 w-full max-w-md p-6 relative animate-scale-in text-white">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-bold mb-1">Reset Your Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered email and we'll send you instructions to set a new password.
            </p>

            {forgotMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <FaCheckCircle className="flex-shrink-0" />
                <span>{forgotMsg}</span>
              </div>
            )}

            {forgotErr && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <FaExclamationCircle className="flex-shrink-0" />
                <span>{forgotErr}</span>
              </div>
            )}

            {!forgotMsg && (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="input-premium py-2.5 text-xs"
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn-gradient w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending Reset Email...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            {forgotMsg && (
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
