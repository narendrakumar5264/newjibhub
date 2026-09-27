import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to reset password');
      }
      setSuccess(true);
      setTimeout(() => navigate('/sign-in'), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50 dark:bg-[#0b1120]">
        <div className="card-premium p-8 max-w-md text-center space-y-3">
          <FaExclamationCircle className="text-rose-500 text-3xl mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invalid Reset Link</h2>
          <p className="text-xs text-slate-500">
            This password reset link is missing a security token or has expired.
          </p>
          <Link to="/sign-in" className="btn-gradient inline-block py-2.5 px-6 rounded-xl text-xs uppercase font-semibold mt-2">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-slate-50 dark:bg-[#0b1120]">
      <div className="card-premium p-8 max-w-md w-full animate-fade-in-up">
        {success ? (
          <div className="text-center space-y-3 py-6">
            <FaCheckCircle className="text-emerald-500 text-4xl mx-auto" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Password Updated!</h2>
            <p className="text-xs text-slate-500">
              Your password has been changed successfully. Redirecting you to sign in...
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Set New Password</h2>
            <p className="text-xs text-slate-500 mb-6">
              Create a new secure password for <span className="font-semibold text-emerald-500">{email}</span>.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="input-premium pl-10 text-xs py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input-premium pl-10 text-xs py-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full py-3 rounded-xl text-xs uppercase tracking-wider font-semibold disabled:opacity-50 mt-2"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
