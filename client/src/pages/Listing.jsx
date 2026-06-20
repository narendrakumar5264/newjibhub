import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BsPlusCircle, BsPencil, BsTrash } from 'react-icons/bs';
import { FaRegEye } from 'react-icons/fa';

export default function Listings() {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) { setError(true); return; }
        setUserListings(data);
        setError(false);
      } catch (err) { setError(true); }
      finally { setLoading(false); }
    };
    if (currentUser?._id) fetchListings();
  }, [currentUser]);

  const handleListingDelete = async (listingId) => {
    const listing = userListings.find((item) => item._id === listingId);
    const result = await Swal.fire({
      title: `Delete "${listing?.jobTitle}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#10b981',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success === false) { Swal.fire('Error', data.message, 'error'); return; }
        setUserListings((prev) => prev.filter((l) => l._id !== listingId));
        Swal.fire('Deleted!', `The listing has been deleted.`, 'success');
      } catch (err) { Swal.fire('Error', 'Failed to delete. Please try again.', 'error'); }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-[#0b1120]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">My Job Listings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">Manage your posted jobs. Add, view, or remove listings below.</p>
          <Link
            to="/create-listing"
            className="inline-flex items-center gap-2 btn-gradient py-3 px-6 rounded-xl text-sm mt-6"
          >
            <BsPlusCircle className="text-lg" />
            Add a New Listing
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-3 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 card-premium max-w-md mx-auto p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-lg font-medium text-rose-600 dark:text-rose-400">Failed to load listings</p>
            <p className="text-sm text-slate-500 mt-1">Please try to re-login.</p>
          </div>
        ) : userListings.length === 0 ? (
          <div className="text-center py-16 card-premium max-w-md mx-auto p-8">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No listings yet</p>
            <p className="text-sm text-slate-500 mt-1">Add a new listing to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {userListings.map((listing) => (
              <div key={listing._id} className="card-premium overflow-hidden hover-lift transition-all duration-300">
                <Link to={`/listing/${listing._id}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.jobTitle}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </Link>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-1">
                    <Link to={`/listing/${listing._id}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      {listing.jobTitle}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {listing.description || 'No description available'}
                  </p>
                  <span className="text-lg font-bold gradient-text">₹{listing.salary}</span>
                </div>

                {/* Actions */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex gap-2">
                    <Link to={`/listing/${listing._id}`}
                      className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                      title="View"
                    >
                      <FaRegEye />
                    </Link>
                    <Link to={`/update-listing/${listing._id}`}
                      className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400 transition-colors"
                      title="Edit"
                    >
                      <BsPencil />
                    </Link>
                  </div>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
