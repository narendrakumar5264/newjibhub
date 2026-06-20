import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../../components/ListingItem.jsx';
import { ThemeContext } from "../../context/ThemeContext";
import { FaBriefcase, FaArrowRight } from 'react-icons/fa';

export default function RecentJobs({ rentListings, saleListings }) {
  const { theme } = useContext(ThemeContext);

  const hasJobs = (rentListings && rentListings.length > 0) || (saleListings && saleListings.length > 0);

  if (!hasJobs) return null;

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 px-4 py-1.5 rounded-full mb-4">
            <FaBriefcase className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5" />
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold uppercase tracking-wider">Live Openings</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Recent <span className="gradient-text">Job Listings</span>
          </h2>
          <p className="mt-3 text-base max-w-xl mx-auto text-slate-500 dark:text-slate-400">
            Hand-picked opportunities from top companies, updated daily.
          </p>
        </div>

        {/* Recent Jobs Grid */}
        {rentListings && rentListings.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentListings.slice(0, 6).map((listing, index) => (
                <div key={listing._id || index}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 btn-gradient px-7 py-3 rounded-xl text-sm"
              >
                Browse All Jobs <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Latest Listings Grid */}
        {saleListings && saleListings.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
              Latest Listings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleListings.slice(0, 6).map((listing, index) => (
                <div key={listing._id || index}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/search?sort=createdAt&order=desc"
                className="inline-flex items-center gap-2 font-semibold px-7 py-3 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                View Latest Listings <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
