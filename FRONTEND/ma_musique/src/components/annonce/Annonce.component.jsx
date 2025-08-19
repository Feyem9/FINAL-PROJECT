import React, { useEffect, useState } from 'react';
import { Navbar } from '../../home/Navbar';
import Footer from '../../home/Footer';
import axios from 'axios';

export const Annonce = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState('');

  // Formulaire de création
  const [form, setForm] = useState({ 
    title: '', 
    type: 'event', 
    description: '', 
    date: new Date().toISOString().slice(0, 16), 
    link: '', 
    image: null, 
    location: '' 
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Utilise la variable d'environnement pour l'URL du backend
  const API_URL = import.meta.env.VITE_TESTING_BACKEND_URI;

  // Recherche et pagination
  useEffect(() => {
    const fetchAnnonces = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/annonce/all`, {
          params: {
            page,
            limit,
            search
          }
        });
        setAnnonces(response.data.annonces || []);
        setTotal(response.data.total || 0);
      } catch (error) {
        console.error('Erreur lors du chargement des annonces :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, [API_URL, page, limit, search]);

  const handleSearchChange = e => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Gestion du formulaire
  const handleFormChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCreate = async e => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('type', form.type);
      formData.append('description', form.description);
      formData.append('date', form.date);
      formData.append('link', form.link);
      if (form.image) formData.append('image', form.image);
      if (form.location) formData.append('location', form.location);

      const token = localStorage.getItem('token');

      const res = await axios.post(`${API_URL}/annonce/create`, formData, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = res.data;
      setAnnonces(prev => [data, ...prev]);
      setForm({ 
        title: '', 
        type: 'event', 
        description: '', 
        date: new Date().toISOString().slice(0, 16), 
        link: '', 
        image: null, 
        location: '' 
      });
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Vous n'avez pas les droits pour créer une annonce. Veuillez vous connecter en tant qu'administrateur.");
      } else {
        setError("Impossible de créer l'annonce: " + (err.response?.data?.message || err.message));
      }
    }

    setCreating(false);
  };
  
  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">School Announcements</h1>
              <p className="text-gray-600">Stay updated with the latest news and events</p>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Announcements</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{annonces.filter(a => {
                    const annonceDate = new Date(a.date);
                    const now = new Date();
                    return annonceDate.getMonth() === now.getMonth() &&
                           annonceDate.getFullYear() === now.getFullYear();
                  }).length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Categories</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{[...new Set(annonces.map(a => a.type))].length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de création */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Announcement</h2>
            <form onSubmit={handleCreate} encType="multipart/form-data" className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter announcement title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    value={form.type}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="event">Event</option>
                    <option value="training">Training</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    value={form.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                    Link *
                  </label>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    value={form.link}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter location (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  value={form.location}
                  onChange={handleFormChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter announcement description"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  onChange={handleFormChange}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search announcements..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <select 
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="event">Event</option>
                <option value="training">Training</option>
                <option value="sale">Sale</option>
              </select>
              <select className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Sort By</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-gray-600 font-medium">Loading announcements...</span>
              </div>
            </div>
          ) : annonces.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl shadow-sm">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No announcements found</h3>
              <p className="text-gray-600 mb-6">There are currently no announcements to display.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {annonces.map(annonce => (
                <div
                  key={annonce._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {annonce.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`${API_URL}/${annonce.image}`}
                        alt={annonce.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="font-bold text-gray-800 text-lg line-clamp-1">{annonce.title}</h2>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        annonce.type === 'event' ? 'bg-blue-100 text-blue-800' : 
                        annonce.type === 'training' ? 'bg-green-100 text-green-800' : 
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {annonce.type.charAt(0).toUpperCase() + annonce.type.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{annonce.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {annonce.date ? new Date(annonce.date).toLocaleDateString() : ''}
                      </span>
                      {annonce.location && (
                        <span>
                          {annonce.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium flex items-center gap-2"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="text-gray-700 font-semibold px-4 py-2">
              Page {page} / {Math.ceil(total / limit) || 1}
            </span>
            <button
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium flex items-center gap-2"
              onClick={() => setPage(p => (p * limit < total ? p + 1 : p))}
              disabled={page * limit >= total}
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
