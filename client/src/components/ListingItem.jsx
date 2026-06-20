import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBriefcase } from 'react-icons/fa';

export default function CompanyCard({ listing }) {
  return (
    <div className="card-premium overflow-hidden hover-lift transition-all duration-300 w-full">
      <Link to={`/listing/${listing._id}`} className="block">
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={listing.imageUrls[0] || 'https://via.placeholder.com/100'}
            alt="company logo"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {listing.jobType && (
            <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600 text-white shadow-lg">
              {listing.jobType}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate mb-1">
            {listing.jobTitle || listing.name}
          </h3>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">
            {listing.companyName}
          </p>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-3">
            <MdLocationOn className="text-emerald-500 flex-shrink-0" />
            <span className="truncate">{listing.city}, {listing.address}</span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
            {listing.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <span className="text-lg font-bold gradient-text">
              ₹{listing.salary}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <FaBriefcase className="text-emerald-400" />
              <span className="truncate max-w-[100px]">{listing.skillsRequired}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
