import React, { useState, useEffect } from "react";
import axios from "axios";

// const API_URL = import.meta.env.VITE_TESTING_BACKEND_URI;
const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI || import.meta.env.VITE_TESTING_BACKEND_URI;


export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'newest'
  });

  const userId = localStorage.getItem('userId') || 'defaultUserId';

  // Fetch user transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const [transactionsResponse, statsResponse] = await Promise.all([
        axios.get(`${API_URL}/transactions?userId=${userId}`),
        axios.get(`${API_URL}/transactions/stats?userId=${userId}`)
      ]);

      setTransactions(transactionsResponse.data);
      setFilteredTransactions(transactionsResponse.data);
      setStats(statsResponse.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
      setError('Impossible de charger l\'historique des transactions');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let dateLimit;

      switch (filters.dateRange) {
        case '7days':
          dateLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          dateLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          dateLimit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateLimit = null;
      }

      if (dateLimit) {
        filtered = filtered.filter(transaction =>
          new Date(transaction.createdAt) >= dateLimit
        );
      }
    }

    // Sort transactions
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount_high':
          return b.totalAmount - a.totalAmount;
        case 'amount_low':
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  // Navigate to transaction details
  const viewTransactionDetails = (transactionId) => {
    window.location.href = `/transaction/${transactionId}`;
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  if (loading) return <div className="text-center p-8 text-lg text-gray-600">Chargement de l'historique...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 m-4">Erreur: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Historique des Transactions</h1>

      {/* Statistics */}
      {stats && (
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{stats.totalTransactions}</h3>
              <p className="text-gray-600 font-medium">Transactions Total</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{stats.totalAmount.toFixed(2)}€</h3>
              <p className="text-gray-600 font-medium">Montant Total</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{stats.completedTransactions}</h3>
              <p className="text-gray-600 font-medium">Transactions Réussies</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{stats.averageAmount.toFixed(2)}€</h3>
              <p className="text-gray-600 font-medium">Montant Moyen</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-800 mb-2">Statut:</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Tous</option>
              <option value="completed">Terminé</option>
              <option value="pending">En attente</option>
              <option value="failed">Échec</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-800 mb-2">Période:</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Toute période</option>
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">90 derniers jours</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-800 mb-2">Trier par:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="amount_high">Montant (décroissant)</option>
              <option value="amount_low">Montant (croissant)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <p className="text-xl text-gray-600">Aucune transaction trouvée</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction._id} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div className="font-mono text-blue-600 font-bold text-lg mb-2 sm:mb-0">
                  #{transaction.transactionId.substring(0, 8)}
                </div>
                <div className={`px-4 py-2 rounded-full font-bold uppercase text-sm ${getStatusBadgeClass(transaction.status)}`}>
                  {getStatusText(transaction.status)}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                <div className="space-y-2 mb-4 lg:mb-0">
                  <p className="text-gray-600 text-sm">
                    {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {transaction.totalAmount.toFixed(2)}€
                  </p>
                  <p className="text-gray-600 text-sm">
                    {transaction.items.length} article(s) - {transaction.items.reduce((sum, item) => sum + item.quantity, 0)} cours
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => viewTransactionDetails(transaction.transactionId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Voir Détails
                  </button>
                </div>
              </div>

              {/* Quick items preview */}
              <div className="flex flex-wrap gap-4 items-center pt-6 border-t border-gray-200">
                {transaction.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={item.courseImage}
                      alt={item.courseName}
                      className="w-8 h-6 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-course.jpg';
                      }}
                    />
                    <span className="text-sm text-gray-600">{item.courseName}</span>
                  </div>
                ))}
                {transaction.items.length > 2 && (
                  <div className="text-sm text-gray-500 italic">
                    +{transaction.items.length - 2} autres
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More / Pagination could be added here */}
    </div>
  );
};