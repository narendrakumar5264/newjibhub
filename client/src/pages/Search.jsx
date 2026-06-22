import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { ThemeContext } from '../context/ThemeContext';
import { FiFilter, FiX } from 'react-icons/fi';
import { CiSearch } from "react-icons/ci";

export default function Search() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    remote: false,
    onsite: false,
    sort: 'created_at',
    order: 'desc',
    city: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const updatedData = {
      searchTerm: urlParams.get('searchTerm') || '',
      city: urlParams.get('city') || '',
      type: urlParams.get('type') || 'all',
      remote: urlParams.get('remote') === 'true',
      onsite: urlParams.get('onsite') === 'true',
      sort: urlParams.get('sort') || 'created_at',
      order: urlParams.get('order') || 'desc',
    };
    setSidebardata((prev) => ({ ...prev, ...updatedData }));

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
        const data = await res.json();
        setListings(data);
        setShowMore(data.length > 8);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'internship' || e.target.id === 'full-time') {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === 'searchTerm' || e.target.id === 'city') {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.value });
    }
    if (e.target.id === 'remote' || e.target.id === 'onsite') {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false });
    }
    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (sidebardata.searchTerm) urlParams.set('searchTerm', sidebardata.searchTerm);
    if (sidebardata.city) urlParams.set('city', sidebardata.city);
    if (sidebardata.type) urlParams.set('type', sidebardata.type);
    if (sidebardata.remote) urlParams.set('remote', sidebardata.remote);
    if (sidebardata.onsite) urlParams.set('onsite', sidebardata.onsite);
    if (sidebardata.sort) urlParams.set('sort', sidebardata.sort);
    if (sidebardata.order) urlParams.set('order', sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  const FilterCheckbox = ({ id, label, checked }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input type="checkbox" id={id} className="peer sr-only" onChange={handleChange} checked={checked} />
        <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all duration-200 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
    </label>
  );

  return (
    <div className={`${theme === "dark" ? "dark" : ""} min-h-screen pt-20 bg-slate-50 dark:bg-[#0b1120]`}>
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky md:top-20 inset-x-0 bottom-0 z-40 md:z-auto
          w-full md:w-72 lg:w-80 md:min-h-[calc(100vh-5rem)]
          bg-white dark:bg-slate-900 md:bg-white/80 md:dark:bg-slate-900/80 md:backdrop-blur-xl
          border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800
          transition-transform duration-300 ease-in-out
          ${showFilters ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
        `}>
          <div className="p-6 overflow-y-auto max-h-[70vh] md:max-h-none">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="md:hidden p-1 text-slate-400 hover:text-slate-600"><FiX size={20} /></button>
            </div>

            <div className="space-y-6">
              {/* Job Type */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Job Type</h3>
                <div className="space-y-2.5">
                  <FilterCheckbox id="all" label="All Types" checked={sidebardata.type === "all"} />
                  <FilterCheckbox id="internship" label="Internship" checked={sidebardata.type === "internship"} />
                  <FilterCheckbox id="full-time" label="Full Time" checked={sidebardata.type === "full-time"} />
                </div>
              </div>

              {/* Work Mode */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Work Mode</h3>
                <div className="space-y-2.5">
                  <FilterCheckbox id="remote" label="Remote" checked={sidebardata.remote} />
                  <FilterCheckbox id="onsite" label="On-Site" checked={sidebardata.onsite} />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Sort By</h3>
                <select
                  onChange={handleChange}
                  defaultValue="createdAt_desc"
                  id="sort_order"
                  className="input-premium text-sm"
                >
                  <option value="createdAt_desc">Latest First</option>
                  <option value="createdAt_asc">Oldest First</option>
                  <option value="salary_desc">Highest Salary</option>
                  <option value="salary_asc">Lowest Salary</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                className="btn-gradient w-full py-3 rounded-xl text-sm uppercase tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-8">
            <form onSubmit={handleSubmit} className="flex-1 max-w-lg relative">
              <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                id="city"
                placeholder="Search by city, company, role..."
                className="input-premium pl-12 pr-4"
                value={sidebardata.city}
                onChange={handleChange}
              />
            </form>
            <button
              className="md:hidden flex items-center gap-2 btn-gradient py-3 px-4 rounded-xl text-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Results Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {sidebardata.city ? (
                <>Jobs in <span className="gradient-text">{sidebardata.city}</span></>
              ) : (
                'All Jobs'
              )}
            </h1>
            {!loading && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{listings.length} result{listings.length !== 1 ? 's' : ''} found</p>}
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {!loading && listings.length === 0 && (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-medium text-slate-400">No jobs found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
              </div>
            )}
            {loading && (
              <div className="col-span-full flex justify-center py-20">
                <div className="w-10 h-10 border-3 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            )}
            {!loading && listings && listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>

          {showMore && (
            <div className="text-center mt-8">
              <button
                onClick={onShowMoreClick}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold text-sm transition-colors"
              >
                Show more results →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}