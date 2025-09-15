import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Charger les cours inscrits au montage du composant
// useEffect(() => {

export const Scourse = () => {
  const [activeTab, setActiveTab] = useState('enrolled');
  const [searchTerm, setSearchTerm] = useState('');
  const [youtubeSearchTerm, setYoutubeSearchTerm] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseViewer, setShowCourseViewer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI || import.meta.env.VITE_TESTING_BACKEND_URI;


  // État pour stocker l'ID utilisateur
  const [userId, setUserId] = useState(null);

  // Récupérer l'ID de l'utilisateur depuis le localStorage ou contexte d'authentification
  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('student'));
    const userIdFromStorage = student ? student._id : null;
    console.log('User ID:', userIdFromStorage);
    setUserId(userIdFromStorage);
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      setError(null);

      if (!userId || !databaseUri) {
        console.error('ERREUR: Variables manquantes', { userId, databaseUri });
        setError('Configuration incomplète');
        setLoading(false);
        return;
      }

      // Construire l'URL avec attention aux espaces
      const url = `${databaseUri}/students/${userId}/enrolled-courses`;

      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (Array.isArray(response.data)) {
          setEnrolledCourses(response.data);
        } else {
          setEnrolledCourses([]);
        }

      } catch (error) {

        if (error.response) {
          console.error('❌ Erreur réponse du serveur:', error.response);
          // Test si c'est vraiment une 404 ou autre chose
          if (error.response.status === 404) {
            console.error('💡 404 - Route non trouvée. Vérifiez:');
            console.error('   - Le serveur tourne-t-il sur le bon port?');
            console.error('   - La route backend est-elle exacte?');
            console.error('   - L\'ID étudiant existe-t-il?');

            setError(`Étudiant non trouvé (404). ID: ${userId}`);
          } else {
            setError(`Erreur ${error.response.status}: ${error.response.data?.message || 'Erreur inconnue'}`);
          }
        } else if (error.request) {
          console.error('❌ Pas de réponse du serveur:', error.request);
          setError('Serveur inaccessible. Vérifiez que le backend tourne.');
        } else {
          console.error('❌ Erreur de configuration:', error.message);
          setError('Erreur de configuration de la requête');
        }

        setEnrolledCourses([]);
      } finally {
        setLoading(false);
        console.log('=== FIN DEBUG ===');
      }
    };

    // Ne déclencher la requête que si userId est disponible
    if (userId) {
      fetchEnrolledCourses();
    }
  }, [userId, databaseUri]);

  // Fonction pour s'inscrire à un cours - Version corrigée
  const handleEnrollCourse = async (course) => {
    setLoading(true);

    try {
      // Vérifier si l'utilisateur est déjà inscrit
      const isAlreadyEnrolled = enrolledCourses.some(enrolledCourse =>
        enrolledCourse._id === course._id || enrolledCourse.id === course._id
      );

      if (isAlreadyEnrolled) {
        alert('Vous êtes déjà inscrit à ce cours !');
        return;
      }

      console.log('Enrolling user:', userId, 'in course:', course._id);

      // Envoyer la demande d'inscription avec les paramètres dans l'URL
      const response = await axios.post(
        `${databaseUri}/students/enroll-course/${userId}/${course._id}`,
        {}, // Body vide car les paramètres sont dans l'URL
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Enrollment response:', response.data);

      // Vérifier la réponse
      if (response.data && response.data.success) {
        // Recharger la liste des cours inscrits
        await fetchEnrolledCourses();
        alert(`Vous êtes maintenant inscrit au cours : ${course.title}`);
      } else {
        throw new Error(response.data?.message || 'Erreur lors de l\'inscription');
      }

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);

      // Gestion des différents types d'erreurs
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data;

        if (status === 404) {
          alert('Étudiant ou cours introuvable.');
        } else if (status === 400) {
          alert(message || 'Vous êtes déjà inscrit à ce cours.');
        } else {
          alert(`Erreur ${status}: ${message}`);
        }
      } else if (error.request) {
        alert('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        alert(error.message || 'Erreur lors de l\'inscription au cours. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le progrès d'un cours
  const updateCourseProgress = async (courseId, progress) => {
    try {
      await axios.put(`${databaseUri}/user/${userId}/course-progress`, {
        courseId: courseId,
        progress: progress
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du progrès:', error);
    }
  };

  // Fonction pour marquer une leçon comme vue
  const markLessonAsCompleted = async (courseId, lessonId) => {
    try {
      await axios.post(`${databaseUri}/user/${userId}/lesson-completed`, {
        courseId: courseId,
        lessonId: lessonId,
        completedAt: new Date().toISOString()
      });

      // Recharger les cours pour mettre à jour le progrès
      await fetchEnrolledCourses();
    } catch (error) {
      console.error('Erreur lors du marquage de la leçon:', error);
    }
  };

  // Fonction pour ouvrir le visualiseur de cours
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseViewer(true);
  };

  // Fonction pour télécharger un fichier
  const handleDownloadFile = (lesson) => {
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = lesson.url;
    link.download = lesson.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Composant pour le visualiseur de cours adapté à votre structure
  const CourseViewer = ({ course, onClose, databaseUri }) => {
    const [isCompleted, setIsCompleted] = useState(course.completed || false);
    const [progress, setProgress] = useState(course.progress || 0);

    // Construire l'URL complète pour les fichiers
    const getFullUrl = (relativePath) => {
      if (!relativePath) return '';
      if (relativePath.startsWith('http')) return relativePath;
      console.log('full url:', `${databaseUri}${relativePath}`);

      return `${databaseUri}${relativePath}`;
    };

    const handleCourseComplete = async () => {
      if (!isCompleted) {
        try {
          // Ici vous pouvez ajouter l'appel API pour marquer le cours comme terminé
          // await markCourseAsCompleted(course._id);
          setIsCompleted(true);
          setProgress(100);
          console.log('Cours marqué comme terminé');
        } catch (error) {
          console.error('Erreur lors de la completion du cours:', error);
        }
      }
    };

    const handleDownloadFile = () => {
      const fileUrl = getFullUrl(course.fileUrl);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${course.title}.${course.media === 'pdf' ? 'pdf' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if (!course.fileUrl) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md">
            <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contenu indisponible</h2>
            <p className="text-gray-600 mb-4">Ce cours n'a pas encore de contenu disponible.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      );
    }

    const fileUrl = `${databaseUri}${course.fileUrl}`;
    console.log(fileUrl);

    const imageUrl = `${databaseUri}${course.image}`;
    console.log(imageUrl);


    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-4">
              {/* Image du cours */}
              {course.image && (
                <img
                  src={`${databaseUri}${course.imageFile}`}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    console.error('Erreur de chargement de l\'image:', imageUrl);
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{course.title}</h2>
                <p className="text-gray-600">{course.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {course.level}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {course.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.media === 'video' ? 'bg-red-100 text-red-800' :
                    course.media === 'pdf' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {course.media.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    Progrès : {progress}% {isCompleted && '• ✅ Terminé'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Contenu principal */}
          <div className="p-6 h-[calc(90vh-120px)] overflow-y-auto">
            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleDownloadFile}
                  className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger
                </button>
                {!isCompleted && (
                  <button
                    onClick={handleCourseComplete}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Marquer terminé
                  </button>
                )}
              </div>
            </div>

            {/* Zone de visualisation du contenu */}
            <div className="bg-gray-100 rounded-lg overflow-hidden min-h-96">
              {course.media === 'video' && (
                <div className="w-full h-full">
                  <video
                    key={fileUrl}
                    controls
                    className="w-full h-96 object-contain bg-black"
                    poster={imageUrl || ''}
                    preload="metadata"
                    onError={(e) => {
                      console.error('Erreur de chargement vidéo:', fileUrl);
                      e.target.style.display = 'none';
                      const errorDiv = e.target.nextElementSibling;
                      if (errorDiv && errorDiv.classList.contains('video-error')) {
                        errorDiv.style.display = 'flex';
                      }
                    }}
                  >
                    <source src={fileUrl} type="video/mp4" />
                    <source src={fileUrl} type="video/webm" />
                    <source src={fileUrl} type="video/ogg" />
                    Votre navigateur ne supporte pas la lecture vidéo HTML5.
                  </video>

                  {/* Message d'erreur pour les vidéos */}
                  <div className="video-error hidden w-full h-96 bg-gray-100 items-center justify-center flex-col">
                    <svg className="w-16 h-16 text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement vidéo</h3>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      La vidéo ne peut pas être lue. Vérifiez le chemin du fichier ou les paramètres du serveur.
                      <br />
                      <span className="text-xs text-gray-500">URL: {fileUrl}</span>
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          const video = document.querySelector('video');
                          const errorDiv = document.querySelector('.video-error');
                          if (video && errorDiv) {
                            video.style.display = 'block';
                            errorDiv.style.display = 'none';
                            video.load();
                          }
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        Réessayer
                      </button>
                      <button
                        onClick={handleDownloadFile}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        Télécharger la vidéo
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Type: Vidéo</p>
                        <p className="text-xs text-gray-500 mt-1">Utilisez les contrôles pour naviguer dans la vidéo</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const video = document.querySelector('video');
                            if (video && video.requestFullscreen) {
                              video.requestFullscreen();
                            }
                          }}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                        >
                          Plein écran
                        </button>
                        <button
                          onClick={() => {
                            const video = document.querySelector('video');
                            if (video) {
                              video.currentTime = 0;
                              video.play();
                            }
                          }}
                          className="px-3 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 transition-colors"
                        >
                          Recommencer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {course.media === 'pdf' && (
                <div className="w-full h-96 flex flex-col">
                  <div className="flex-1 bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <iframe
                      src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                      className="w-full h-full border-0"
                      title={course.title}
                      onError={(e) => {
                        console.log('Erreur iframe PDF, affichage du fallback');
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />

                    {/* Fallback si l'iframe ne fonctionne pas */}
                    <div className="w-full h-full hidden items-center justify-center flex-col p-8 bg-gray-50">
                      <svg className="w-16 h-16 text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Impossible d'afficher le PDF</h3>
                      <p className="text-sm text-gray-600 text-center mb-2">
                        Le PDF ne peut pas être affiché directement dans le navigateur.
                      </p>
                      <p className="text-xs text-gray-500 text-center mb-4">
                        URL: {fileUrl}
                      </p>
                      <div className="flex space-x-3">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          Ouvrir dans un nouvel onglet
                        </a>
                        <button
                          onClick={handleDownloadFile}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          Télécharger le PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Type: PDF</p>
                        <p className="text-xs text-gray-500">Utilisez les contrôles du PDF pour naviguer</p>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Nouvel onglet
                        </a>
                        <button
                          onClick={() => {
                            const iframe = document.querySelector('iframe');
                            if (iframe) {
                              iframe.src = iframe.src;
                            }
                          }}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                        >
                          Recharger
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {course.media === 'audio' && (
                <div className="flex flex-col items-center justify-center h-96 p-8">
                  <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.9 14.2A1 1 0 014 13.4V6.6a1 1 0 01.9-.8l3.483-2.616z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600">Fichier audio</p>
                    </div>

                    <audio
                      key={fileUrl}
                      controls
                      className="w-full"
                      preload="metadata"
                    >
                      <source src={fileUrl} type="audio/mpeg" />
                      <source src={fileUrl} type="audio/wav" />
                      <source src={fileUrl} type="audio/ogg" />
                      Votre navigateur ne supporte pas la lecture audio HTML5.
                    </audio>

                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">Utilisez les contrôles audio pour écouter le contenu</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Message d'erreur si le type n'est pas reconnu */}
              {!['video', 'pdf', 'audio'].includes(course.media) && (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-lg font-medium">Type de contenu non supporté</p>
                    <p className="text-sm">Type: {course.media}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Informations du cours</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Prix:</span>
                  <span className="ml-2 font-medium">${course.amount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Catégorie:</span>
                  <span className="ml-2 font-medium">{course.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Niveau:</span>
                  <span className="ml-2 font-medium">{course.level}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type de média:</span>
                  <span className="ml-2 font-medium">{course.media}</span>
                </div>
              </div>
              {course.description && (
                <div className="mt-3">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-sm text-gray-800">{course.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fetch available courses from database
  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const response = await axios.get(`${databaseUri}/course/all`);
        setAvailableCourses(response.data);
      } catch (error) {
        console.error('Error fetching available courses:', error);
        // Fallback to mock data
        setAvailableCourses([]);
      }
    };

    fetchAvailableCourses();
  }, []);

  // Fetch YouTube videos
  const fetchYoutubeVideos = async (query) => {
    if (!query) return;

    try {
      const response = await axios.get(`${databaseUri}/course/search-youtube?q=${encodeURIComponent(query)}`);

      // Transform YouTube data to match course format
      const transformedVideos = response.data.map(video => ({
        id: video.videoId,
        title: video.title,
        description: video.description,
        image: video.thumbnail,
        instructor: 'YouTube Instructor',
        category: 'YouTube',
        level: 'All Levels',
        rating: 5,
        students: 0,
        price: 0,
        isYoutubeVideo: true,
        videoId: video.videoId
      }));

      setYoutubeVideos(transformedVideos);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      setYoutubeVideos([]);
    }
  };

  // Fetch YouTube videos when component mounts
  useEffect(() => {
    fetchYoutubeVideos('music');
  }, []);

  const handleAddToCart = async (course) => {
    try {
      if (!course || !course._id) {
        toast.error('Informations du cours manquantes');
        return;
      }

      const student = JSON.parse(localStorage.getItem('student'));
      if (!student || !student._id) {
        toast.error('Vous devez être connecté pour ajouter un cours au panier');
        return;
      }

      console.log(`Ajout du cours "${course.title}" au panier...`);

      const response = await axios.post(`${databaseUri}/course/add-to-cart`, {
        courseId: course._id,
        userId: student._id
      });

      if (response.data.success) {
        toast.success(`Cours "${course.title}" ajouté au panier`);
      } else {
        toast.warning(response.data.message || 'Ajout au panier avec avertissement');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.error('Impossible d\'ajouter ce cours au panier');
    }
  };

  // Version basique améliorée


  // Filter courses based on search term
  const filteredEnrolledCourses = enrolledCourses.filter(course =>
    (levelFilter ? course.level === levelFilter : true) &&
    (typeFilter ? course.category === typeFilter : true) &&
    (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAvailableCourses = availableCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter YouTube videos based on search term
  const filteredYoutubeVideos = youtubeVideos.filter(video =>
    video.title.toLowerCase().includes(youtubeSearchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(youtubeSearchTerm.toLowerCase())
  );

  // Apply level and type filters to enrolled courses
  const filteredAndSortedEnrolledCourses = filteredEnrolledCourses
    .filter(course => levelFilter ? course.level === levelFilter : true)
    .filter(course => typeFilter ? course.category === typeFilter : true);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Courses</h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Search Section */}
      {activeTab === 'youtube' && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Find YouTube Tutorials</h2>
              <p className="text-gray-600">Search for music tutorials on YouTube</p>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search YouTube tutorials..."
                  value={youtubeSearchTerm}
                  onChange={(e) => setYoutubeSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={() => fetchYoutubeVideos(youtubeSearchTerm)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`py-2 px-4 font-medium ${activeTab === 'enrolled'
              ? 'text-amber-600 border-b-2 border-amber-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            My Enrolled Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-4 font-medium ${activeTab === 'available'
              ? 'text-amber-600 border-b-2 border-amber-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Available Courses
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`py-2 px-4 font-medium ${activeTab === 'youtube'
              ? 'text-amber-600 border-b-2 border-amber-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            YouTube Courses
          </button>
        </div>
      </div>

      {/* Enrolled Courses */}
      {activeTab === 'enrolled' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEnrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={`${databaseUri}${course.image}`}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                </div>

                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{course.level}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{course.category}</span>
                </div>

                <p className="text-gray-600 text-sm mb-3">Instructor: {course.instructor}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-800">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">Next Lesson: {course.nextLesson}</p>
                  <p className="text-xs text-amber-600">{course.nextLessonDate}</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleViewCourse(course)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all"
                  >
                    Voir le cours
                  </button>

                  {course.courseContent && course.courseContent.lessons && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        {course.courseContent.lessons.length} leçon{course.courseContent.lessons.length > 1 ? 's' : ''} disponible{course.courseContent.lessons.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Courses */}
      {activeTab === 'available' && (
        <div>
          {/* Regular Courses */}
          {filteredAvailableCourses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Available Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailableCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={`${databaseUri}${course.image}`}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                      </div>

                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{course.level}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{course.category}</span>
                      </div>

                      <div>
                        <button
                          onClick={() => handleAddToCart(course)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 6h14l-1.3 8.5a2 2 0 0 1-2 1.7H9a2 2 0 0 1-2-1.7L5 6Z" />
                            <path d="M8.5 6l2.2-3h2.6L15.5 6" />
                            <circle cx="9" cy="20" r="1.6" fill="currentColor" />
                            <circle cx="16" cy="20" r="1.6" fill="currentColor" />
                            <circle cx="19" cy="5" r="3.2" fill="currentColor" opacity="0.12" />
                            <path d="M19 3.8v2.4M17.8 5h2.4" />
                          </svg>
                        </button>

                      </div>

                      <p className="text-gray-600 text-sm mb-2">{course.description}</p>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">${course.amount}</span>
                        <button
                          onClick={() => handleEnrollCourse(course)}
                          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                        >
                          S'inscrire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* youtube Courses */}
      {activeTab === 'youtube' && (
        <div>
          {/* YouTube Videos */}
          <h3 className="text-xl font-bold text-gray-800 mb-4">YouTube Tutorials</h3>
          {filteredYoutubeVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredYoutubeVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={video.image}
                      alt={video.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <a
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-red-600 rounded-full p-3 hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </a>
                    </div>
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      YouTube
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{video.title}</h3>
                    </div>

                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{video.level}</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{video.category}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">Instructor: {video.instructor}</p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.965 9.21c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-gray-700 text-sm">{video.rating}</span>
                      </div>
                      <span className="text-gray-600 text-sm">Free</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No YouTube videos found</h3>
              <p className="mt-1 text-gray-500">Try searching for music tutorials on YouTube</p>
            </div>
          )}
        </div>
      )}

      {/* Already Viewed Courses */}
      {activeTab === 'already' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.filter(c => c.viewed).map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={course.imageFile}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                </div>

                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{course.level}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{course.category}</span>
                </div>

                <p className="text-gray-600 text-sm mb-3">Instructor: {course.instructor}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-800">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">Next Lesson: {course.nextLesson}</p>
                  <p className="text-xs text-amber-600">{course.nextLessonDate}</p>
                </div>

                <button className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all">Resume Course</button>

                <div className="mt-4">
                  <button className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all">Mark as Complete</button>
                </div>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* Course Viewer Modal */}
      {showCourseViewer && selectedCourse && (
        <CourseViewer
          course={selectedCourse}
          onClose={() => {
            setShowCourseViewer(false);
            setSelectedCourse(null);
          }}
          databaseUri="http://localhost:3000"
        />
      )}
    </div>
  );
};