import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_TESTING_BACKEND_URI;

export const TransactionDetails = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transaction details
  const fetchTransactionDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/transactions/${transactionId}`);
      setTransaction(response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement de la transaction:', error);
      setError('Transaction introuvable');
    } finally {
      setLoading(false);
    }
  };

  // Cancel transaction
  const cancelTransaction = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette transaction ?')) {
      return;
    }

    try {
      await axios.post(`${API_URL}/transactions/${transactionId}/cancel`);
      await fetchTransactionDetails(); // Refresh data
      alert('Transaction annulée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      alert('Impossible d\'annuler la transaction');
    }
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
  }; getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'status-success';
      case 'pending': return 'status-warning';
      case 'failed': return 'status-error';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  // Get status text in French
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  // Get payment method text
  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'card': return 'Carte bancaire';
      case 'paypal': return 'PayPal';
      case 'bank_transfer': return 'Virement bancaire';
      default: return method;
    }
  };

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails();
    }
  }, [transactionId]);

  if (loading) return <div className="text-center p-8 text-lg text-gray-600">Chargement de la transaction...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 m-4">Erreur: {error}</div>;
  if (!transaction) return <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 m-4">Transaction introuvable</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b-2 border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Détails de la Transaction</h1>
        <div className={`px-4 py-2 rounded-full font-bold uppercase text-sm ${getStatusBadgeClass(transaction.status)}`}>
          {getStatusText(transaction.status)}
        </div>
      </div>

      {/* Transaction Info */}
      <div className="mb-8">
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Informations Générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">ID Transaction:</label>
              <span className="text-gray-900">{transaction.transactionId}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Date de création:</label>
              <span className="text-gray-900">{new Date(transaction.createdAt).toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Dernière mise à jour:</label>
              <span className="text-gray-900">{new Date(transaction.updatedAt).toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">ID Utilisateur:</label>
              <span className="text-gray-900">{transaction.userId}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Méthode de paiement:</label>
              <span className="text-gray-900">{getPaymentMethodText(transaction.paymentMethod)}</span>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Montant total:</label>
              <span className="text-2xl font-bold text-green-600">{transaction.totalAmount.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        {transaction.paymentDetails && (
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Détails du Paiement</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {transaction.paymentDetails.cardLastFour && (
                <p className="text-gray-700">Carte se terminant par: <span className="font-semibold">****{transaction.paymentDetails.cardLastFour}</span></p>
              )}
              {transaction.paymentDetails.paypalEmail && (
                <p className="text-gray-700">Email PayPal: <span className="font-semibold">{transaction.paymentDetails.paypalEmail}</span></p>
              )}
              {transaction.paymentDetails.bankReference && (
                <p className="text-gray-700">Référence bancaire: <span className="font-semibold">{transaction.paymentDetails.bankReference}</span></p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Articles Commandés</h2>
        <div className="space-y-6">
          {transaction.items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <img 
                src={item.courseImage} 
                alt={item.courseName} 
                className="w-full sm:w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-course.jpg';
                }}
              />
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.courseName}</h4>
                <p className="text-gray-600 mb-4">{item.courseDescription}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Prix unitaire: {item.price.toFixed(2)}€
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Quantité: {item.quantity}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                    Total: {(item.price * item.quantity).toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-8 rounded-lg border-l-4 border-blue-500 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg text-gray-700">Nombre d'articles:</span>
          <span className="text-lg font-semibold text-gray-900">{transaction.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
          <span className="text-xl font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-green-600">{transaction.totalAmount.toFixed(2)}€</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => window.history.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Retour
        </button>

        {transaction.status === 'pending' && (
          <button 
            onClick={cancelTransaction}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Annuler la Transaction
          </button>
        )}

        {transaction.status === 'completed' && (
          <button 
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Imprimer/Télécharger
          </button>
        )}
      </div>
    </div>
  );
};