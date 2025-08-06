import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Annonce = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState(0);

  // Formulaire de création
  const [form, setForm] = useState({ titre: '', description: '', image: null });
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
      formData.append('titre', form.titre);
      formData.append('description', form.description);
      if (form.image) formData.append('image', form.image);

      const token = localStorage.getItem('token');

      const res = await axios.post(`${API_URL}/annonce/create`, formData, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = res.data;
      setAnnonces(prev => [data, ...prev]);
      setForm({ titre: '', description: '', image: null });
    } catch (err) {
      setError("Impossible de créer l'annonce");
    }

    setCreating(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Annonces de l'école & du monde musical
        </h1>

        {/* Formulaire de création */}
        <form
          className="bg-white rounded-lg shadow p-4 mb-8 flex flex-col gap-3"
          onSubmit={handleCreate}
          encType="multipart/form-data"
        >
          <h2 className="text-lg font-semibold text-indigo-700">Créer une annonce</h2>
          <input
            type="text"
            name="titre"
            placeholder="Titre"
            className="border rounded px-3 py-2"
            value={form.titre}
            onChange={handleFormChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="border rounded px-3 py-2"
            value={form.description}
            onChange={handleFormChange}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            className="border rounded px-3 py-2"
            onChange={handleFormChange}
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
          <button
            type="submit"
            disabled={creating}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            {creating ? 'Création...' : 'Créer'}
          </button>
        </form>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            className="w-full sm:w-1/2 px-4 py-2 border rounded shadow focus:outline-none"
            value={search}
            onChange={handleSearchChange}
          />
          <span className="text-gray-500 text-sm">{total} annonce(s)</span>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-indigo-500 font-semibold">Chargement des annonces...</span>
          </div>
        ) : annonces.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Aucune annonce trouvée.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {annonces.map(annonce => (
              <div
                key={annonce._id}
                className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 border-l-4 border-indigo-400 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-indigo-700">{annonce.titre}</h2>
                <p className="text-gray-700">{annonce.description}</p>
                {annonce.image && (
                  <img
                    src={`${API_URL}/${annonce.image}`}
                    alt={annonce.titre}
                    className="w-full h-40 object-cover rounded mt-2"
                  />
                )}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {annonce.createdAt
                      ? new Date(annonce.createdAt).toLocaleDateString()
                      : ''}
                  </span>
                  {annonce.createdBy && (
                    <span className="text-xs text-gray-500">
                      Par {annonce.createdBy.name || 'Administration'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </button>
          <span className="text-gray-700 font-semibold">
            Page {page} / {Math.ceil(total / limit) || 1}
          </span>
          <button
            className="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50"
            onClick={() => setPage(p => (p * limit < total ? p + 1 : p))}
            disabled={page * limit >= total}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};
