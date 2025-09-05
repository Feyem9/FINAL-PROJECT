import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Sprofile = () => {
  // Get student data from localStorage
  const [studentData, setStudentData] = useState(JSON.parse(localStorage.getItem('student')));
  if (!studentData) return <p>Étudiant non connecté.</p>;

  // Correction: Utilisez student pour initialiser les états
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(studentData.image || null);
  const [formData, setFormData] = useState({
    name: studentData.name || '',
    email: studentData.email || '',
    contact: studentData.contact || '',
    level: studentData.level || '',
    instrument: studentData.instrument || '',
    password: studentData.password || '',
    // La localisation est gérée séparément
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Ajout pour le mode édition

  const [location, setLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Crée une URL de données pour la prévisualisation immédiate
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
          }, (err) => {
            console.error("Erreur de géolocalisation:", err);
            setError("Impossible de récupérer la localisation.");
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

  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format d\'image non supporté.');
    }

    if (file.size > maxSize) {
      throw new Error('L\'image est trop volumineuse.');
    }

    return true;
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      validateImage(selectedImage);

      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedImage);

      const studentId = student._id;
      if (!studentId) {
        throw new Error('ID de l\'étudiant non trouvé');
      }

      const response = await axios.post(
        `${databaseUri}/students/${studentId}/upload-profile-image`,
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Extraction robuste de l'URL d'image pour s'adapter à plusieurs formats de réponse du serveur
      const imageUrl = response.data?.data?.imageUrl ||
        response.data?.imageUrl ||
        response.data?.profileImage?.imageUrl ||
        response.data?.result?.imageUrl ||
        response.data?.profileImage; // Gardez le cas original en dernier recours

      // Met à jour les données dans le localStorage
      const updatedStudent = { ...student, image: imageUrl };
      localStorage.setItem('student', JSON.stringify(updatedStudent));

      // Met à jour les états pour l'affichage
      setImagePreview(imageUrl);
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
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const studentId = studentData._id;
      const token = localStorage.getItem('token');
      console.log(token);
      console.log(studentId)
      const response = await axios.put(`${databaseUri}/students/${studentId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Response data:', response.data);

      // Met à jour le localStorage avec les données de la réponse du serveur
      const updatedStudent = { ...studentData, ...response.data };
      localStorage.setItem('student', JSON.stringify(updatedStudent));

      // Met à jour le formulaire pour refléter les nouvelles données
      setStudentData(updatedStudent);
      setFormData(response.data);
      setSuccess('Profil mis à jour avec succès!');

    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      throw new Error('Failed to update profile', { cause: err });
      setTimeout(() => setSuccess(null), 3000);

    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: student.name || '',
      email: student.email || '',
      contact: student.contact || '',
      level: student.level || '',
      instrument: student.instrument || '',
    });
    setIsEditing(false);
  };

  const handleImageError = (e) => {
    console.error('Erreur de chargement d\'image:', e.target.src);
    // Affiche l'avatar par défaut si l'image ne se charge pas
    setImagePreview(null);
  };

  // Correction : fonction getImageUrl revue pour une meilleure robustesse
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Si c'est déjà une URL complète (renvoyée par le serveur)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Si c'est une Data URI (pour la prévisualisation locale)
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }

    // Sinon, on suppose que c'est un chemin relatif renvoyé par le serveur
    // On extrait le nom de fichier et on construit la bonne URL
    const filename = imagePath.split('/').pop();
    return `${databaseUri}/profile-images/file/${filename}`;
  };


  const progressData = [
    { course: 'Piano Basics', progress: 85, color: 'bg-blue-500' },
    { course: 'Music Theory', progress: 72, color: 'bg-green-500' },
    { course: 'Chord Progressions', progress: 60, color: 'bg-amber-500' },
    { course: 'Jazz Piano', progress: 45, color: 'bg-red-500' },
  ];

  const upcomingTasks = [
    { title: 'Practice Piano Exercises', due: 'Tomorrow', priority: 'high' },
    { title: 'Complete Music Theory Quiz', due: 'In 3 days', priority: 'medium' },
    { title: 'Submit Chord Assignment', due: 'Next week', priority: 'low' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Profile</h1>
        <p className="text-gray-600">Manage your profile information and track your progress</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
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
                    <div className="absolute -bottom-8 left-0 text-xs text-gray-500 max-w-32 truncate">
                      {getImageUrl(imagePreview)}
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {studentData.name?.charAt(0) || 'S'}
                  </div>
                )}
                <label htmlFor="imageUpload" className="absolute bottom-0 right-0 bg-amber-500 rounded-full p-2 cursor-pointer shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <h2 className="text-lg font-bold text-gray-800 mt-4">{studentData.name || 'Student'}</h2>
              <p className="text-gray-600 text-sm">{studentData.email || 'student@example.com'}</p>
              {selectedImage && !uploading && (
                <button
                  onClick={handleImageUpload}
                  disabled={loading}
                  className={`mt-3 px-3 py-1 text-white text-sm rounded-lg transition-all shadow ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'}`}
                >
                  {loading ? 'Saving...' : 'Save Photo'}
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
              {error && (
                <div className="mt-3 text-red-500 text-sm text-center">{error}</div>
              )}
              {success && (
                <div className="mt-3 text-green-500 text-sm text-center">{success}</div>
              )}
            </div>
            <div className="mt-6 space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'progress' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Progress Overview
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Account Settings
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Learning Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Courses Enrolled</span>
                <span className="font-semibold">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assignments Completed</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quizzes Taken</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold">72%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg transition-colors ${loading ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
              )}
              {success && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">{success}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Current Level</label>
                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Password</label>
                  <input
                    type="text"
                    name="password"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Instrument</label>
                  <input
                    type="text"
                    name="instrument"
                    value={formData.instrument}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Role</label>
                  <p className="font-medium text-gray-800 capitalize">{studentData.role || 'student'}</p>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Member Since</label>
                  <p className="font-medium text-gray-800">
                    {studentData.createdAt ? new Date(studentData.createdAt).toLocaleDateString() : 'Not available'}
                  </p>
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
                          <p><strong>IP :</strong> {location?.ip}</p>
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
              </div>
            </div>
          )}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Course Progress</h2>
                <div className="space-y-5">
                  {progressData.map((course, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">{course.course}</span>
                        <span className="text-gray-600">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${course.color}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Tasks</h2>
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-amber-50 rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-gray-800">{task.title}</p>
                        <p className="text-sm text-gray-500">Due: {task.due}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Change Password</h4>
                        <p className="text-gray-600 text-sm">Update your password regularly for better security</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                        Change
                      </button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                        <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Email Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">SMS Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};