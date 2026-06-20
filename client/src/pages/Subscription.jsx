import React, { useState } from 'react';
import { FaCheckCircle, FaCrown, FaRocket, FaBolt, FaLock, FaCreditCard, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

const Subscription = () => {
  const [email, setEmail] = useState('');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
  const [selectedPlan, setSelectedPlan] = useState('Advanced');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email, cardDetails, selectedPlan);
    alert(`Thank you for subscribing to the ${selectedPlan} plan with ${email}`);
    setEmail('');
    setCardDetails({ cardNumber: '', expiryDate: '', cvv: '' });
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const plans = [
    {
      name: "Basic", price: "$9.99", icon: <FaBolt className="text-blue-500" />,
      desc: "For beginners", features: ["Access to job listings", "Basic resume analysis", "Email support"],
    },
    {
      name: "Advanced", price: "$19.99", icon: <FaRocket className="text-teal-500" />,
      desc: "Most popular", features: ["All Basic features", "AI interview prep", "Priority applications", "Advanced analytics"],
      popular: true,
    },
    {
      name: "Ninja", price: "$29.99", icon: <FaCrown className="text-amber-500" />,
      desc: "For experts", features: ["All Advanced features", "Direct recruiter access", "Resume boosting", "Dedicated support"],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-[#0b1120]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-3 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 rounded-full">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">✨ Premium Plans</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">JobHub Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Choose the perfect plan and unlock career opportunities.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in-up">
          {/* Plans */}
          <div className="lg:col-span-3 space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative card-premium p-6 cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.name
                    ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{plan.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{plan.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold gradient-text">{plan.price}</p>
                    <p className="text-xs text-slate-400">/month</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.features.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                      <FaCheckCircle className="text-emerald-500 text-[10px]" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="lg:col-span-2">
            <div className="card-premium p-6 sm:p-8 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Complete Subscription</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                  <input className="input-premium" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Card Number</label>
                  <div className="relative">
                    <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input className="input-premium pl-11" type="text" placeholder="4242 4242 4242 4242" name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Expiry</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input className="input-premium pl-11" type="text" placeholder="MM/YY" name="expiryDate" value={cardDetails.expiryDate} onChange={handleCardChange} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CVV</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input className="input-premium pl-11" type="text" placeholder="123" name="cvv" value={cardDetails.cvv} onChange={handleCardChange} required />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-gradient w-full py-3.5 rounded-xl text-sm uppercase tracking-wider mt-2">
                  Subscribe to {selectedPlan} • {plans.find(p => p.name === selectedPlan)?.price}/mo
                </button>
              </form>
              <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-1">
                <FaInfoCircle /> Auto-renews. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;