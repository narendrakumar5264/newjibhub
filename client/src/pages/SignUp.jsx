import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/auth/OAuth';
import { FaUser, FaEnvelope, FaLock, FaStar, FaChartLine, FaUsers } from 'react-icons/fa';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('You must accept the Terms and Conditions to proceed.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      setSubmitted(true);
      setTimeout(() => navigate('/sign-in'), 2500);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 animate-gradient-shift">
        {/* Decorative Shapes */}
        <div className="absolute top-16 right-16 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-24 left-8 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '0.8s' }} />

        <div className="relative z-10 flex flex-col justify-center items-start px-16 text-white">
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Start your<br />
              <span className="text-yellow-300">career journey</span>
            </h1>
            <p className="mt-4 text-lg text-cyan-100 max-w-md leading-relaxed">
              Join thousands of professionals who found their dream job through JobHub.
            </p>
          </div>

          <div className="space-y-5 stagger-children">
            {[
              { icon: <FaStar />, text: "Free resume analysis with AI scoring" },
              { icon: <FaChartLine />, text: "Track your applications in real-time" },
              { icon: <FaUsers />, text: "Connect with top recruiters directly" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 glass rounded-xl px-5 py-3">
                <div className="text-yellow-300 text-lg">{item.icon}</div>
                <span className="text-sm font-medium text-cyan-50">{item.text}</span>
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
            {submitted ? (
              /* Success state after signup */
              <div className="text-center py-8 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Created!</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  📧 Welcome email on its way! Check spam if you don't see it.
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">Redirecting to sign in...</p>
              </div>
            ) : (
              /* Registration form */
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create Account</h1>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">Get started with your free account today.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="text"
                        placeholder="johndoe"
                        className="input-premium pl-11"
                        id="username"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

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

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer group mt-1">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        id="terms"
                        className="peer sr-only"
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all duration-200 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                      I accept the <span className="text-emerald-600 dark:text-emerald-400 font-medium">Terms and Conditions</span>
                    </span>
                  </label>

                  <button
                    disabled={loading}
                    className="btn-gradient w-full py-3.5 mt-2 rounded-xl text-sm uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : 'Create Account'}
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-800/60 px-3 text-slate-400">or continue with</span>
                    </div>
                  </div>

                  <OAuth />
                </form>

                <div className="text-center mt-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/sign-in" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-center">
                    <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">{error}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
