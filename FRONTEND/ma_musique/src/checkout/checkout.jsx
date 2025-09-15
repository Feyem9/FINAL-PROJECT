import React, { useState, useEffect } from "react";
import axios from "axios";

// const API_URL = import.meta.env.VITE_TESTING_BACKEND_URI;
const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI || import.meta.env.VITE_TESTING_BACKEND_URI;


export const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: '',
    paypalEmail: '',
    bankReference: ''
  });
  const [processingPayment, setProcessingPayment] = useState(false);

  const userId = localStorage.getItem('userId') || 'defaultUserId';

  // Fetch cart items for checkout
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cart`);
      setCart(response.data);

      // Calculate total
      const totalAmount = response.data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotal(totalAmount);

      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      setError('Impossible de charger les articles du panier');
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    const res = await fetch("http://localhost:3000/transactions/checkout", { method: "POST" });
    const data = await res.json();
    console.log(data);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentDetails({
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
      cardName: '',
      paypalEmail: '',
      bankReference: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate payment details
  const validatePaymentDetails = () => {
    if (paymentMethod === 'card') {
      return paymentDetails.cardNumber &&
        paymentDetails.cardExpiry &&
        paymentDetails.cardCVC &&
        paymentDetails.cardName;
    } else if (paymentMethod === 'paypal') {
      return paymentDetails.paypalEmail;
    } else if (paymentMethod === 'bank_transfer') {
      return paymentDetails.bankReference;
    }
    return false;
  };

  // Process checkout
  const processCheckout = async () => {
    if (!validatePaymentDetails()) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    if (cart.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);

      // Prepare transaction data
      const transactionData = {
        userId,
        items: cart.map(item => ({
          courseId: item.courseId,
          courseName: item.courseName,
          courseImage: item.courseImage,
          courseDescription: item.courseDescription,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        paymentMethod,
        paymentDetails: getPaymentDetailsForTransaction()
      };

      // Create transaction
      const transactionResponse = await axios.post(`${API_URL}/transactions`, transactionData);
      const transaction = transactionResponse.data;

      // Process payment
      const paymentResponse = await axios.post(`${API_URL}/transactions/${transaction.transactionId}/process`);

      if (paymentResponse.data.status === 'completed') {
        // Payment successful - clear cart
        await axios.delete(`${API_URL}/cart`);

        // Redirect to success page
        alert('Paiement réussi! Votre commande a été traitée.');
        window.location.href = `/transaction/${transaction.transactionId}`;
      } else {
        // Payment failed
        setError('Le paiement a échoué. Veuillez réessayer.');
      }

    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setError('Une erreur est survenue lors du traitement du paiement');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Get payment details for transaction (secure version)
  const getPaymentDetailsForTransaction = () => {
    if (paymentMethod === 'card') {
      return {
        cardLastFour: paymentDetails.cardNumber.slice(-4)
      };
    } else if (paymentMethod === 'paypal') {
      return {
        paypalEmail: paymentDetails.paypalEmail
      };
    } else if (paymentMethod === 'bank_transfer') {
      return {
        bankReference: paymentDetails.bankReference
      };
    }
    return {};
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) return <div className="text-center p-8 text-lg text-gray-600">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la Commande</h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mb-6">{error}</div>}

      {/* Order Summary */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Résumé de la Commande</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={item.courseImage}
                alt={item.courseName}
                className="w-full sm:w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{item.courseName}</h4>
                <p className="text-gray-600 text-sm mb-2">Quantité: {item.quantity}</p>
                <p className="font-bold text-green-600">{(item.price * item.quantity).toFixed(2)}€</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 mt-6">
          <h3 className="text-2xl font-bold text-green-600">Total: {total.toFixed(2)}€</h3>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Méthode de Paiement</h2>

        <div className="space-y-4">
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'card'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              className="mr-3 text-blue-600"
            />
            <span className="font-medium text-gray-800">Carte Bancaire</span>
          </label>

          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'paypal'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}>
            <input
              type="radio"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              className="mr-3 text-blue-600"
            />
            <span className="font-medium text-gray-800">PayPal</span>
          </label>

          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'bank_transfer'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}>
            <input
              type="radio"
              value="bank_transfer"
              checked={paymentMethod === 'bank_transfer'}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              className="mr-3 text-blue-600"
            />
            <span className="font-medium text-gray-800">Virement Bancaire</span>
          </label>
        </div>
      </div>

      {/* Payment Details Form */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Détails du Paiement</h2>

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Numéro de carte"
              value={paymentDetails.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              maxLength={16}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                value={paymentDetails.cardExpiry}
                onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                maxLength={5}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="CVC"
                value={paymentDetails.cardCVC}
                onChange={(e) => handleInputChange('cardCVC', e.target.value)}
                maxLength={3}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="text"
              placeholder="Nom sur la carte"
              value={paymentDetails.cardName}
              onChange={(e) => handleInputChange('cardName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {paymentMethod === 'paypal' && (
          <div>
            <input
              type="email"
              placeholder="Adresse email PayPal"
              value={paymentDetails.paypalEmail}
              onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {paymentMethod === 'bank_transfer' && (
          <div>
            <input
              type="text"
              placeholder="Référence de virement"
              value={paymentDetails.bankReference}
              onChange={(e) => handleInputChange('bankReference', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 font-mono leading-relaxed">
                Effectuez le virement vers: <br />
                IBAN: FR76 1234 5678 9012 3456 7890 123 <br />
                BIC: BANKFRPP <br />
                Référence: {paymentDetails.bankReference}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Retour au Panier
        </button>

        <button
          // onClick={processCheckout}
          onClick={checkout}
          disabled={processingPayment || !validatePaymentDetails()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
        >
          {processingPayment ? 'Traitement...' : `Payer ${total.toFixed(2)}€`}
        </button>
      </div>
    </div>
  );
};