import { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { ThemeContext } from '../context/ThemeContext';
import { FiFilter, FiX } from 'react-icons/fi';
import { CiSearch } from "react-icons/ci";
import { FaTimes, FaBriefcase, FaUndo } from 'react-icons/fa';

export default function Search() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    remote: false,
    onsite: false,
    sort: 'createdAt',
    order: 'desc',
    city: ''
  });

  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const debounceTimerRef = useRef(null);

  // Sync state from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const updatedData = {
      searchTerm: urlParams.get('searchTerm') || urlParams.get('company') || '',
      city: urlParams.get('city') || '',
      type: urlParams.get('type') || 'all',
      remote: urlParams.get('remote') === 'true',
      onsite: urlParams.get('onsite') === 'true',
      sort: urlParams.get('sort') || 'createdAt',
      order: urlParams.get('order') || 'desc',
    };
    setSidebardata(updatedData);
    setSearchInput(updatedData.city || updatedData.searchTerm || '');

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setListings(data);
          setShowMore(data.length > 8);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [location.search]);

  // Push new query to URL
  const applyQuery = (newData) => {
    const urlParams = new URLSearchParams();
    if (newData.searchTerm) urlParams.set('searchTerm', newData.searchTerm);
    if (newData.city) urlParams.set('city', newData.city);
    if (newData.type && newData.type !== 'all') urlParams.set('type', newData.type);
    if (newData.remote) urlParams.set('remote', 'true');
    if (newData.onsite) urlParams.set('onsite', 'true');
    if (newData.sort) urlParams.set('sort', newData.sort);
    if (newData.order) urlParams.set('order', newData.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  // Debounced search handler for live typing
  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const nextData = { ...sidebardata, city: val, searchTerm: val };
      setSidebardata(nextData);
      applyQuery(nextData);
    }, 400);
  };

  const handleFilterToggle = (key, value) => {
    const nextData = { ...sidebardata, [key]: value };
    setSidebardata(nextData);
    applyQuery(nextData);
  };

  const removeChip = (key) => {
    let nextData = { ...sidebardata };
    if (key === 'type') nextData.type = 'all';
    else if (key === 'remote') nextData.remote = false;
    else if (key === 'onsite') nextData.onsite = false;
    else if (key === 'city' || key === 'searchTerm') {
      nextData.city = '';
      nextData.searchTerm = '';
      setSearchInput('');
    }
    setSidebardata(nextData);
    applyQuery(nextData);
  };

  const clearAllFilters = () => {
    const resetData = {
      searchTerm: '',
      type: 'all',
      remote: false,
      onsite: false,
      sort: 'createdAt',
      order: 'desc',
      city: '',
    };
    setSidebardata(resetData);
    setSearchInput('');
    applyQuery(resetData);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    try {
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      if (data.length < 9) setShowMore(false);
      setListings([...listings, ...data]);
    } catch (e) {
      console.error(e);
    }
  };

  // Active filter chips list
  const activeChips = [];
  if (sidebardata.city) activeChips.push({ key: 'city', label: `Location: "${sidebardata.city}"` });
  if (sidebardata.searchTerm && sidebardata.searchTerm !== sidebardata.city) {
    activeChips.push({ key: 'searchTerm', label: `Keyword: "${sidebardata.searchTerm}"` });
  }
  if (sidebardata.type && sidebardata.type !== 'all') {
    activeChips.push({ key: 'type', label: sidebardata.type === 'full-time' ? 'Full Time' : 'Internship' });
  }
  if (sidebardata.remote) activeChips.push({ key: 'remote', label: 'Remote Only' });
  if (sidebardata.onsite) activeChips.push({ key: 'onsite', label: 'On-Site' });

  return (
    <div className={`${theme === "dark" ? "dark" : ""} min-h-screen pt-20 bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row">
        {/* Desktop Sticky Sidebar */}
        <aside className={`
          fixed md:sticky md:top-20 inset-x-0 bottom-0 z-40 md:z-auto
          w-full md:w-72 lg:w-80 md:h-[calc(100vh-5rem)]
          bg-white dark:bg-slate-900 md:bg-white/90 md:dark:bg-slate-900/90 md:backdrop-blur-xl
          border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800
          transition-transform duration-300 ease-in-out md:overflow-y-auto
          ${showFilters ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
        `}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Filter Vacancies
              </h2>
              {activeChips.length > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-rose-500 hover:underline font-semibold flex items-center gap-1">
                  <FaUndo className="text-[10px]" /> Reset
                </button>
              )}
              <button onClick={() => setShowFilters(false)} className="md:hidden p-1 text-slate-400">
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* Job Type Radio/Checkboxes */}
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-[11px]">Contract Type</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Openings' },
                    { id: 'full-time', label: 'Full-Time Positions' },
                    { id: 'internship', label: 'Internships' },
                  ].map((t) => (
                    <label key={t.id} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="jobTypeRadio"
                        checked={sidebardata.type === t.id}
                        onChange={() => handleFilterToggle('type', t.id)}
                        className="text-emerald-500 focus:ring-emerald-400"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Mode */}
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-[11px]">Workplace Setup</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sidebardata.remote}
                      onChange={(e) => handleFilterToggle('remote', e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-emerald-400"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Remote Only</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sidebardata.onsite}
                      onChange={(e) => handleFilterToggle('onsite', e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-emerald-400"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">On-Site / Hybrid</span>
                  </label>
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-[11px]">Sort By</h3>
                <select
                  value={`${sidebardata.sort}_${sidebardata.order}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('_');
                    const nextData = { ...sidebardata, sort, order };
                    setSidebardata(nextData);
                    applyQuery(nextData);
                  }}
                  className="input-premium py-2 text-xs"
                >
                  <option value="createdAt_desc">Latest First (Newest)</option>
                  <option value="createdAt_asc">Oldest First</option>
                  <option value="salary_desc">Highest Compensation</option>
                  <option value="salary_asc">Lowest Compensation</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Search Results View */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {/* Top Search Bar & Mobile Filter Trigger */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 max-w-xl relative">
              <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search job title, skills, company, or city..."
                className="input-premium pl-12 pr-4 text-xs py-3"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              {searchInput && (
                <button
                  onClick={() => removeChip('city')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-gradient py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center gap-2"
            >
              <FiFilter /> Filters
            </button>
          </div>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[11px] text-slate-400 uppercase font-bold mr-1">Active:</span>
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                >
                  {chip.label}
                  <button onClick={() => removeChip(chip.key)} className="hover:opacity-75">
                    <FaTimes className="text-[10px]" />
                  </button>
                </span>
              ))}
              <button onClick={clearAllFilters} className="text-xs text-slate-400 hover:text-rose-400 ml-1">
                Clear all
              </button>
            </div>
          )}

          {/* Results Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {sidebardata.city || sidebardata.searchTerm ? (
                <>Jobs matching <span className="gradient-text">"{sidebardata.city || sidebardata.searchTerm}"</span></>
              ) : (
                'All Available Opportunities'
              )}
            </h1>
            {!loading && (
              <span className="text-xs text-slate-500 font-medium">
                {listings.length} vacancy{listings.length !== 1 ? 'ies' : ''} found
              </span>
            )}
          </div>

          {/* Skeletons Loader when Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="card-premium p-5 space-y-4 animate-pulse">
                  <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && listings.length === 0 && (
            <div className="card-premium p-12 text-center max-w-lg mx-auto my-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                <FaBriefcase />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs match your search</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeChips.length > 0
                  ? "Try relaxing specific filters (e.g. removing 'Remote Only' or clearing location keywords)."
                  : "We currently do not have vacancies matching this search query."}
              </p>
              {activeChips.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="btn-gradient py-2 px-5 rounded-xl text-xs uppercase tracking-wider font-semibold"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          )}

          {/* Listings Grid */}
          {!loading && listings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {/* Show More Pagination */}
          {showMore && !loading && (
            <div className="text-center mt-10">
              <button
                onClick={onShowMoreClick}
                className="btn-gradient py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider font-semibold"
              >
                Load More Openings →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}