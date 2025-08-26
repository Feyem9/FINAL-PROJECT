import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Profile = () => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  if (!admin) return <p>Admin non connecté.</p>;

  const [formData, setFormData] = useState({
    name: admin.name || '',
    email: admin.email || '',
    contact: admin.contact || '',
    // Assurez-vous que l'emplacement est initialisé, sinon il peut être undefined
    location: admin.location || 'Inconnue',
  });
  const [location, setLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(admin);
  const [success, setSuccess] = useState(null);

  // États pour l'upload d'image
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(admin.image || null);
  const [isEditing, setIsEditing] = useState(false); // Ajout d'un état pour le mode édition

  const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
            const res = await fetch(url);
            const data = await res.json();

            setLocation({
              city: data.address?.city || data.address?.town || data.address?.village || "Inconnue",
              region: data.address?.state || "Inconnue",
              country: data.address?.country || "Inconnu",
              latitude: lat,
              longitude: lon,
              isGPS: true,
            });
            // Met à jour le formData avec la localisation récupérée
            setFormData(prev => ({
              ...prev,
              location: data.address?.city || data.address?.town || data.address?.village || "Inconnue",
            }));
            setLoading(false);
          }, (err) => {
            console.error("Erreur de géolocalisation:", err);
            setError("Impossible de récupérer la localisation.");
            setLoading(false);
          });
        } else {
          setError("La géolocalisation n'est pas supportée par ce navigateur.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'adresse:", err);
        setError("Erreur lors de la récupération de la localisation.");
        setLoading(false);
      }
    };
    fetchLocation();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // C'est ici que l'URL de données est créée pour la prévisualisation
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      validateImage(selectedImage);
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedImage);
      const adminId = adminData._id;

      if (!adminId) {
        throw new Error('ID de l\'admin non trouvé');
      }

      const response = await axios.post(
        `${databaseUri}/profile/${adminId}/upload-profile-image`,
        formDataUpload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            } else {
              // Cas où progressEvent.total est nul (estimation)
              const loaded = progressEvent.loaded;
              const estimatedTotal = selectedImage.size;
              const percentCompleted = Math.round((loaded * 100) / estimatedTotal);
              setUploadProgress(Math.min(percentCompleted, 99));
            }
          },
        }
      );

      // Extraction robuste de l'URL de l'image
      const imageUrl = response.data?.data?.imageUrl || response.data?.imageUrl || response.data?.profileImage;

      if (!imageUrl) {
        throw new Error('URL d\'image non retournée par le serveur');
      }

      // Mise à jour de tous les états et du localStorage avec la nouvelle URL de l'image du serveur
      const updatedAdmin = { ...adminData, image: imageUrl };
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      setAdminData(updatedAdmin);
      setImagePreview(imageUrl); // Utilisation de l'URL du serveur pour la prévisualisation
      setSelectedImage(null);
      setUploadProgress(100);

      setSuccess('Photo de profil mise à jour avec succès!');
      setTimeout(() => {
        setSuccess(null);
        setUploadProgress(0);
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      let errorMessage = 'Erreur lors de l\'upload de l\'image';
      if (error.response) {
        errorMessage = error.response.data?.message || `Erreur ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Impossible de contacter le serveur';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    // Logic pour enregistrer les changements du formulaire
    try {
      const adminId = adminData._id;
      const response = await axios.put(`${databaseUri}/admins/${adminId}`, formData);
      const updatedAdmin = { ...adminData, ...formData };
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      setAdminData(updatedAdmin);
      setSuccess('Profil mis à jour avec succès!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCancel = () => {
    // Réinitialise les données du formulaire aux valeurs initiales de l'adminData
    setFormData({
      name: adminData.name || '',
      email: adminData.email || '',
      contact: adminData.contact || '',
      location: adminData.location || 'Inconnue',
    });
    setIsEditing(false); // Quitte le mode édition si vous l'avez
  };

  const handleImageError = (e) => {
    console.error('Erreur de chargement d\'image:', e.target.src);
    // Optionnel: définir une image par défaut
    e.target.style.display = 'none';
    // Ou afficher l'avatar par défaut
    setImagePreview(null);
  };

  const validateImage = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Type d\'image non valide.');
    }

    if (file.size > maxSize) {
      throw new Error('L\'image est trop volumineuse.');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    // Si c'est déjà une data URI (pour la prévisualisation locale)
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }

    // Si c'est déjà une URL complète (du serveur)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Si c'est une URL de profile-images (nouveau endpoint)
    if (imagePath.startsWith('/profile-images/')) {
      return `${databaseUri}${imagePath}`;
    }

    // Si c'est un chemin relatif qui commence par /uploads/ (ancien format)
    if (imagePath.startsWith('/uploads/')) {
      // Utiliser le nouveau endpoint profile-images
      const filename = imagePath.split('/').pop();
      return `${databaseUri}/profile-images/file/${filename}`;
    }

    // Si c'est juste le nom du fichier
    if (!imagePath.startsWith('/')) {
      return `${databaseUri}/profile-images/file/${imagePath}`;
    }

    // Par défaut, utiliser l'endpoint profile-images
    const filename = imagePath.split('/').pop();
    return `${databaseUri}/profile-images/file/${filename}`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
        </header>

        {/* Messages de succès et d'erreur */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p>{success}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Account Status</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">Active</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Member Since</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {admin.createdAt ? new Date(admin.createdAt).getFullYear() : '2023'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Role</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {admin.isSuperAdmin ? 'Super Admin' : admin.role}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(imagePreview)}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
                        onError={handleImageError}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {admin.name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <label htmlFor="imageUpload" className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 cursor-pointer">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {/* Barre de progression améliorée */}
                {uploading && (
                  <div className="w-full mt-4">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${uploadProgress}%`,
                          transform: `translateX(${uploadProgress === 0 ? '-100%' : '0%'})`
                        }}
                      >
                        <div className="h-full w-full bg-white bg-opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-600">Upload en cours...</p>
                      <p className="text-sm font-semibold text-orange-600">{uploadProgress}%</p>
                    </div>
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-800 mt-4">{admin.name}</h2>
                <p className="text-gray-600">{admin.email}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                  {admin.isSuperAdmin ? 'Super Admin' : admin.role}
                </span>
                {selectedImage && !uploading && (
                  <button
                    onClick={handleImageUpload}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Enregistrer la photo
                    </div>
                  </button>
                )}
                {uploading && (
                  <button disabled className="mt-4 px-6 py-3 bg-gray-400 cursor-not-allowed text-white rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Téléchargement... {uploadProgress}%</span>
                    </div>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{admin.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{admin.contact || 'Non fourni'}</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <strong>Ville :</strong> {location?.city || 'Inconnue'}
                    </button>
                    {showModal && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                          <h2 className="text-xl font-bold mb-4">Localisation complète</h2>
                          <p><strong>Ville :</strong> {location?.city}</p>
                          <p><strong>Région :</strong> {location?.region}</p>
                          <p><strong>Pays :</strong> {location?.country}</p>
                          <p><strong>Latitude :</strong> {location?.latitude}</p>
                          <p><strong>Longitude :</strong> {location?.longitude}</p>
                          <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            Fermer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Membre depuis</span>
                  <span className="font-medium">
                    {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('fr-FR') : 'Non spécifié'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    id="contact"
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </div>
            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-800">Change Password</h3>
                    <p className="text-gray-600 text-sm">Update your password regularly for better security</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm">
                    Change
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                    <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm">
                    Enable
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-800">Active Sessions</h3>
                    <p className="text-gray-600 text-sm">Manage devices that are currently logged in</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};