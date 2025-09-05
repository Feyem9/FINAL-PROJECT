import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from '../home/Navbar';
import Footer from '../home/Footer';

// const API_URL = import.meta.env.VITE_TESTING_BACKEND_URI;
const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;


export const Cart = () => {
  const [cart, setCart] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseImage, setCourseImage] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Simulation de l'utilisateur connecté pour l'exemple
  const authorId = localStorage.getItem('userId') || 'defaultUserId';

  // Fetch cart items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cart`);
      setCart(response.data);
      calculateTotal(response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      setError('Impossible de charger le panier');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCartItems = async (courseId) => {
    try {
      const cartItem = {
        courseId,
        courseName,
        courseImage,
        courseDescription,
        quantity: parseInt(quantity),
        price: parseFloat(price)
      };

      const response = await axios.post(`${API_URL}/cart/add`, cartItem);

      // Refresh cart after adding
      await fetchItems();

      // Reset form
      setCourseName('');
      setCourseImage('');
      setCourseDescription('');
      setQuantity(1);
      setPrice('');

      alert('Article ajouté au panier avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setError('Impossible d\'ajouter l\'article au panier');
    }
  };

  // Update cart item quantity
  const updateCartItems = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) return;

      await axios.patch(`${API_URL}/cart/${itemId}`, { quantity: newQuantity });
      await fetchItems(); // Refresh cart
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Impossible de mettre à jour l\'article');
    }
  };

  // Remove single cart item
  const removeCartItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/${itemId}`);
      await fetchItems(); // Refresh cart
      alert('Article supprimé du panier');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Impossible de supprimer l\'article');
    }
  };

  // Clear entire cart
  const removeCartItems = async () => {
    try {
      if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
        await axios.delete(`${API_URL}/cart`);
        await fetchItems(); // Refresh cart
        alert('Panier vidé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      setError('Impossible de vider le panier');
    }
  };

  // Calculate total price
  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(totalAmount);
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    // Redirect to transaction/checkout page
    window.location.href = '/checkout';
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <div className="text-center p-8 text-lg text-gray-600">Chargement du panier...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 m-4">Erreur: {error}</div>;

  const checkout = async () => {
    try {
      const res = await fetch("http://localhost:3000/transactions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      console.log("Checkout response:", data);
      console.log(data.redirect)

      if (data?.redirect) {
        // Rediriger l’utilisateur vers la page PayUnit
        window.location.href = data.redirect;
      } else {
        alert("Erreur: Pas d’URL de paiement retournée.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Échec du paiement");
    }
  };

  const startPayment = async () => {
    try {
      const response = await fetch("http://localhost:3001/transaction/checkout", {
        method: "POST",
      });
      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; // Redirection PayUnit
      } else {
        console.error("Pas de lien de redirection reçu !");
      }
    } catch (err) {
      console.error("Erreur lors du paiement :", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Panier d'Achat</h1>
          </div>
        </header>
        <h1 className="text-3xl font-bold text-gray-900 mb-8"></h1>

        {/* Add Item Form */}
        {/* <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Ajouter un cours</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="ID du cours"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Nom du cours"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="url"
            placeholder="Image du cours"
            value={courseImage}
            onChange={(e) => setCourseImage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            placeholder="Description du cours"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Quantité"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Prix"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => addToCartItems(courseName)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Ajouter au Panier
          </button>
        </div>
      </div> */}

        {/* Cart Items */}
        <div className="mb-8">
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={item.courseImage}
                      alt={item.courseName}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.courseName}</h4>
                      <p className="text-gray-600 mb-4">{item.courseDescription}</p>

                      <div className="flex items-center gap-4 mb-4">
                        <button
                          onClick={() => updateCartItems(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                        >
                          -
                        </button>
                        <span className="font-medium text-gray-800 min-w-max">Quantité: {item.quantity}</span>
                        <button
                          onClick={() => updateCartItems(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-green-600">
                          Prix: {item.price}€ × {item.quantity} = {(item.price * item.quantity).toFixed(2)}€
                        </p>
                        <button
                          onClick={() => removeCartItem(item._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="bg-gray-50 p-8 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Résumé du Panier</h3>
            <div className="space-y-2 mb-6">
              <p className="text-gray-700">Nombre d'articles: <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></p>
              <p className="text-2xl font-bold text-green-600">Total: {total.toFixed(2)}€</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={removeCartItems}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Vider le Panier
              </button>
              <button
                // onClick={startPayment}
                onClick={checkout}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Procéder au Paiement
              </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};