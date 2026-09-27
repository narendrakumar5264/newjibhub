import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { FaUser, FaEnvelope, FaLock, FaStar, FaChartLine, FaUsers, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Password strength calculation
  const getPasswordStrength = (pass = '') => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, text: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, text: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, text: 'Good', color: 'bg-teal-500' };
    return { score: 100, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('You must accept the Terms and Conditions to proceed.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Signup failed');
      }

      setSubmitted(true);

      // Auto sign-in for seamless experience
      try {
        const signinRes = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const signinData = await signinRes.json();
        if (signinRes.ok && signinData.success !== false) {
          dispatch(signInSuccess(signinData));
          setTimeout(() => navigate('/'), 1800);
          return;
        }
      } catch (e) {
        // Fallback to sign-in redirect
      }

      setTimeout(() => navigate('/sign-in'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 animate-gradient-shift">
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
              Join thousands of professionals finding their dream roles through JobHub's AI platform.
            </p>
          </div>

          <div className="space-y-4 stagger-children">
            {[
              { icon: <FaStar />, text: "Single-pass resume ATS score auditing" },
              { icon: <FaChartLine />, text: "Real-time AI Mock Interviews with speech rating" },
              { icon: <FaUsers />, text: "Direct applications with automated AI role matching" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 glass rounded-xl px-5 py-3">
                <div className="text-yellow-300 text-lg">{item.icon}</div>
                <span className="text-sm font-medium text-cyan-50">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-[#0b1120]">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-extrabold">
              <span className="text-slate-800 dark:text-white">Job</span>
              <span className="gradient-text">Hub</span>
            </h2>
          </div>

          <div className="card-premium p-8 sm:p-10">
            {submitted ? (
              <div className="text-center py-8 animate-scale-in space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 flex items-center justify-center mx-auto text-3xl">
                  <FaCheckCircle />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Aboard!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your account has been created and verified. Launching your career workspace...
                </p>
                <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mt-4" />
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Sign up to practice interviews and apply to verified vacancies.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="input-premium pl-11 text-xs py-3"
                        id="username"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
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
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="password"
                        placeholder="At least 6 characters"
                        className="input-premium pl-11 text-xs py-3"
                        id="password"
                        required
                        minLength={6}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Visual Password Strength Bar */}
                    {formData.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500">Security:</span>
                          <span className="font-bold text-slate-300">{strength.text}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                            style={{ width: `${strength.score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer group mt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      I agree to the <span className="text-emerald-500 font-semibold">Terms of Service</span> and Privacy Policy.
                    </span>
                  </label>

                  <button
                    disabled={loading}
                    className="btn-gradient w-full py-3.5 mt-2 rounded-xl text-xs uppercase tracking-wider font-semibold disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : 'Create Free Account'}
                  </button>
                </form>

                {error && (
                  <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-center flex items-center justify-center gap-2">
                    <FaExclamationCircle className="text-rose-500 text-xs shrink-0" />
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
                  </div>
                )}

                <div className="text-center mt-6">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/sign-in" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
