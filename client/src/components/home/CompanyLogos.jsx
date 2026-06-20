import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from "../../context/ThemeContext";
import samsung from '../../assets/samsung.jpeg';
import google from '../../assets/google.jpeg';
import meta from '../../assets/meta.jpeg';
import hp from '../../assets/hp.jpeg';
import intuit from '../../assets/intuit.jpeg';
import tcs from '../../assets/tcs.jpeg';
import intel from '../../assets/intel.jpeg';
import microsoft from '../../assets/microsoft.jpeg';

const companies = [
  { name: "Microsoft", image: microsoft, openings: "1234" },
  { name: "Intel",     image: intel,     openings: "100" },
  { name: "TCS",       image: tcs,       openings: "450" },
  { name: "Intuit",    image: intuit,    openings: "700" },
  { name: "HP",        image: hp,        openings: "240" },
  { name: "Meta",      image: meta,      openings: "100" },
  { name: "Google",    image: google,    openings: "450" },
  { name: "Samsung",   image: samsung,   openings: "240" },
];

export default function CompanyLogos() {
  const [visibleCount, setVisibleCount] = useState(4);
  const { theme } = useContext(ThemeContext);

  const handleToggle = () => {
    setVisibleCount(visibleCount === 4 ? companies.length : 4);
  };

  return (
    <section className="py-16 bg-white dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-emerald-600 dark:text-emerald-400">
            Top Employers
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Job Openings Across <span className="gradient-text">Companies</span>
          </h2>
          <p className="mt-3 text-base max-w-md mx-auto text-slate-500 dark:text-slate-400">
            Explore thousands of roles from world-class companies hiring now.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {companies.slice(0, visibleCount).map((company, index) => (
            <Link to={`/search?company=${company.name.toLowerCase()}`} key={index}>
              <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover-lift">
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs text-cyan-300 font-medium mb-0.5">{company.openings}+ Openings</p>
                  <h3 className="text-white text-lg font-bold leading-tight">{company.name}</h3>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-emerald-600/10 transition-opacity duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Toggle Button */}
        <div className="text-center mt-10">
          <button
            onClick={handleToggle}
            className="px-8 py-3 rounded-xl font-semibold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {visibleCount === 4 ? "Show All Companies" : "Show Less"}
          </button>
        </div>
      </div>
    </section>
  );
}
