import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Tprofile = () => {
  // Get teacher data from localStorage
  const [teacherData, setTeacherData] = useState(JSON.parse(localStorage.getItem('teacher')) || {});

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(teacherData.image || null);
  const [formData, setFormData] = useState({
    name: teacherData.name || '',
    email: teacherData.email || '',
    contact: teacherData.contact || '',
    speciality: teacherData.speciality || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [location, setLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // États pour l'upload d'image
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Configuration de l'API (remplacez par votre URL)
  const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
          });
        } else {
          setError("La géolocalisation n'est pas supportée par ce navigateur.");
        }
      } catch (err) {
        setError("Impossible de récupérer la localisation.");
      }
    };

    fetchLocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonction utilitaire pour valider l'image avant upload
  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format d\'image non supporté. Utilisez JPEG, PNG, GIF ou WebP');
    }

    if (file.size > maxSize) {
      throw new Error('L\'image est trop volumineuse. Taille maximum: 5MB');
    }

    return true;
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

      const teacherId = teacherData._id;
      if (!teacherId) {
        throw new Error('ID du professeur non trouvé');
      }

      console.log('🚀 Upload de l\'image pour le teacher:', teacherId);
      console.log('🔧 Database URI:', databaseUri);

      const response = await axios.post(
        `${databaseUri}/teachers/${teacherId}/upload-profile-image`,
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            } else {
              const loaded = progressEvent.loaded;
              const estimatedTotal = selectedImage.size;
              const percentCompleted = Math.round((loaded * 100) / estimatedTotal);
              setUploadProgress(Math.min(percentCompleted, 99));
            }
          },
        }
      );

      console.log('✅ Réponse complète:', response.data);

      // Extraction robuste de l'URL d'image
      const imageUrl = response.data?.data?.imageUrl ||
        response.data?.imageUrl ||
        response.data?.profileImage?.imageUrl ||
        response.data?.result?.imageUrl;

      console.log('🖼️ URL d\'image extraite:', imageUrl);

      if (!imageUrl) {
        console.error('❌ Structure de réponse inattendue:', response.data);
        throw new Error('URL d\'image non retournée par le serveur');
      }

      // Test de l'URL construite
      const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${databaseUri}${imageUrl}`;
      console.log('🔗 URL complète construite:', fullImageUrl);

      // Tester si l'image est accessible
      try {
        const testResponse = await fetch(fullImageUrl, { method: 'HEAD' });
        console.log('🧪 Test d\'accessibilité de l\'image:', testResponse.status);
        if (!testResponse.ok) {
          console.warn('⚠️ L\'image n\'est pas accessible via l\'URL construite');
        }
      } catch (testError) {
        console.warn('⚠️ Erreur lors du test d\'accessibilité:', testError.message);
      }

      // Mettre à jour les données
      const updatedTeacher = {
        ...teacherData,
        profileImage: imageUrl,
        image: imageUrl,
      };

      localStorage.setItem('teacher', JSON.stringify(updatedTeacher));
      setTeacherData(updatedTeacher);

      // Forcer le refresh de l'image avec un timestamp pour éviter le cache
      const timestampedUrl = `${fullImageUrl}?t=${Date.now()}`;
      setImagePreview(timestampedUrl);

      setSelectedImage(null);
      setUploadProgress(100);

      setSuccess('Photo de profil mise à jour avec succès!');
      setTimeout(() => {
        setSuccess(null);
        setUploadProgress(0);
      }, 3000);

    } catch (error) {
      console.error('❌ Erreur complète:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response status:', error.response?.status);

      let errorMessage = 'Erreur lors de l\'upload de l\'image';

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Image invalide. Vérifiez le format et la taille';
            break;
          case 404:
            errorMessage = 'Professeur non trouvé';
            break;
          case 413:
            errorMessage = 'Image trop volumineuse (max 5MB)';
            break;
          case 500:
            errorMessage = 'Erreur serveur. Veuillez réessayer';
            break;
          default:
            errorMessage = error.response.data?.message || `Erreur ${error.response.status}`;
        }
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
  const handleSaveChanges = () => {
    // In a real implementation, you would send this to your backend
    // For now, we'll just update localStorage
    const updatedTeacher = { ...teacherData, ...formData };
    localStorage.setItem('teacher', JSON.stringify(updatedTeacher));
    setTeacherData(updatedTeacher);

    setIsEditing(false);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: teacherData.name || '',
      email: teacherData.email || '',
      contact: teacherData.contact || '',
      speciality: teacherData.speciality || '',
    });
    setIsEditing(false);
  };

  // Fonction pour gérer les erreurs de chargement d'image
  const handleImageError = (e) => {
    console.error('Erreur de chargement d\'image:', e.target.src);
    // Optionnel: définir une image par défaut
    e.target.style.display = 'none';
    // Ou afficher l'avatar par défaut
    setImagePreview(null);
  };

  // Fonction utilitaire mise à jour pour construire l'URL de l'image
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Si c'est déjà une URL complète (http/https)
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
    <div className="max-w-6xl mx-auto">
      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Teacher Profile</h1>
        <p className="text-gray-600">Manage your profile information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Image Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Picture</h2>

            <div className="flex flex-col items-center">
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(imagePreview)}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
                      onError={handleImageError}
                      onLoad={() => console.log('✅ Image chargée avec succès:', getImageUrl(imagePreview))}
                    />
                    {/* Indicateur de debug - à retirer en production */}
                    <div className="absolute -bottom-8 left-0 text-xs text-gray-500 max-w-32 truncate">
                      {getImageUrl(imagePreview)}
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {teacherData.name?.charAt(0) || 'T'}
                  </div>
                )}
                <label htmlFor="imageUpload" className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-2 cursor-pointer shadow-lg hover:bg-orange-600 transition-colors">
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

              {selectedImage && !uploading && (
                <button
                  onClick={handleImageUpload}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg transition-all shadow-md transform hover:scale-105"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Sauvegarder Photo</span>
                  </div>
                </button>
              )}

              {uploading && (
                <button
                  disabled
                  className="mt-4 px-6 py-3 bg-gray-400 cursor-not-allowed text-white rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Upload... {uploadProgress}%</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Courses Created</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Students Taught</span>
                <span className="font-semibold">142</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assignments Graded</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-semibold">{teacherData.createdAt ? new Date(teacherData.createdAt).toLocaleDateString() : 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{teacherData.name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{teacherData.email || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{teacherData.contact || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Speciality</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{teacherData.speciality || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Role</label>
                <p className="font-medium text-gray-800 capitalize">{teacherData.role || 'teacher'}</p>
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">Member Since</label>
                <p className="font-medium text-gray-800">
                  {teacherData.createdAt ? new Date(teacherData.createdAt).toLocaleDateString() : 'Not available'}
                </p>
              </div>

              {location && (
                <div className="md:col-span-2">
                  <label className="block text-gray-600 text-sm mb-1">Location</label>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Ville: {location?.city}
                    </button>

                    {/* Modal */}
                    {showModal && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                          <h2 className="text-xl font-bold mb-4">Localisation complète</h2>
                          <div className="space-y-2">
                            <p><strong>Ville:</strong> {location.city}</p>
                            <p><strong>Région:</strong> {location.region}</p>
                            <p><strong>Pays:</strong> {location.country}</p>
                            <p><strong>Latitude:</strong> {location.latitude}</p>
                            <p><strong>Longitude:</strong> {location.longitude}</p>
                          </div>

                          <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                          >
                            Fermer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">Change Password</h3>
                  <p className="text-gray-600 text-sm">Update your password regularly for better security</p>
                </div>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                  Change
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                  <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};