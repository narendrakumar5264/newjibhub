import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { FaEnvelope, FaLock, FaBriefcase, FaRocket, FaShieldAlt } from 'react-icons/fa';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 animate-gradient-shift">
        {/* Decorative Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col justify-center items-start px-16 text-white">
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Welcome back to<br />
              <span className="text-yellow-300">JobHub</span>
            </h1>
            <p className="mt-4 text-lg text-emerald-100 max-w-md leading-relaxed">
              Your gateway to premium career opportunities. Sign in to access your dashboard.
            </p>
          </div>

          <div className="space-y-5 stagger-children">
            {[
              { icon: <FaBriefcase />, text: "Access 1M+ premium job listings" },
              { icon: <FaRocket />, text: "AI-powered interview preparation" },
              { icon: <FaShieldAlt />, text: "Secure & trusted by thousands" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 glass rounded-xl px-5 py-3">
                <div className="text-yellow-300 text-lg">{item.icon}</div>
                <span className="text-sm font-medium text-emerald-50">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-[#0b1120]">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-extrabold">
              <span className="text-slate-800 dark:text-white">Job</span>
              <span className="gradient-text">Hub</span>
            </h2>
          </div>

          <div className="card-premium p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Sign In</h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input-premium pl-11"
                    id="email"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-premium pl-11"
                    id="password"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="btn-gradient w-full py-3.5 mt-2 rounded-xl text-sm uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
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
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/sign-up" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                  Create one
                </Link>
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-center">
                <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
