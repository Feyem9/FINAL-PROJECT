import React, { useState, useEffect } from 'react';
import { Chats } from '../../dashboards/chats/Chats';
import axios from 'axios';
import { toast } from 'react-toastify';

export const Tchat = () => {
  // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;


  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [senderId, setSenderId] = useState('');
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);

        // Récupération des informations du professeur
        const storedTeacher = JSON.parse(localStorage.getItem('teacher'));

        if (!storedTeacher || !storedTeacher._id) {
          setError('Informations du professeur introuvables. Veuillez vous reconnecter.');
          toast.error('Session expirée. Veuillez vous reconnecter.');
          return;
        }

        console.log('Professeur connecté:', storedTeacher);
        setTeacher(storedTeacher);
        setSenderId(storedTeacher._id);

        // Récupération de la liste des étudiants
        await fetchStudents();

      } catch (err) {
        console.error('Erreur lors de l\'initialisation:', err);
        setError('Erreur lors du chargement des données');
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, []);

  const fetchStudents = async () => {
    try {
      console.log('Récupération des étudiants...');
      const res = await axios.get(`${databaseUri}/students/all`);
      console.log(res);


      if (res.data && Array.isArray(res.data)) {
        console.log('Étudiants récupérés:', res.data.length);
        setStudents(res.data);
        setError(null);
      } else {
        console.warn('Format de données incorrect:', res.data);
        setError('Format de données incorrect');
        toast.warning('Aucun étudiant trouvé');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des étudiants:', err);
      setError('Impossible de charger la liste des étudiants');

      if (err.response?.status === 404) {
        toast.error('Service étudiants non disponible');
      } else if (err.response?.status >= 500) {
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        toast.error('Erreur lors du chargement des étudiants');
      }
    }
  };

  const handleSelectStudent = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);

    if (studentId) {
      const selectedStudent = students.find(s => s._id === studentId);
      console.log('Étudiant sélectionné:', selectedStudent);
      toast.info(`Chat avec ${selectedStudent?.name || 'l\'étudiant'} ouvert`);
    }
  };

  const handleRefreshStudents = async () => {
    setLoading(true);
    await fetchStudents();
    setLoading(false);
    toast.success('Liste des étudiants actualisée');
  };

  // Filtrage des étudiants selon le terme de recherche
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedStudentName = () => {
    const student = students.find(s => s._id === selectedStudentId);
    return student?.name || 'Étudiant inconnu';
  };

  // Affichage de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur critique
  if (error && !teacher) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Actualiser la page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Tableau de bord Professeur
              </h1>
              <p className="text-gray-600">
                Bienvenue, {teacher?.name || 'Professeur'} - Gérez vos conversations avec les étudiants
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{students.length}</span> étudiant{students.length > 1 ? 's' : ''}
              </div>
              <button
                onClick={handleRefreshStudents}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Sélection d'étudiant */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Sélectionner un étudiant
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Barre de recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sélecteur d'étudiant */}
            <div className="relative">
              <select
                onChange={handleSelectStudent}
                value={selectedStudentId}
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">-- Choisir un étudiant --</option>
                {filteredStudents.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} {student.email ? `(${student.email})` : ''}
                  </option>
                ))}
              </select>
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Affichage des résultats de recherche */}
          {searchTerm && (
            <div className="text-sm text-gray-600 mb-4">
              {filteredStudents.length} résultat{filteredStudents.length > 1 ? 's' : ''} trouvé{filteredStudents.length > 1 ? 's' : ''}
              {searchTerm && ` pour "${searchTerm}"`}
            </div>
          )}

          {/* Liste des étudiants récents/favoris */}
          {!selectedStudentId && students.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Étudiants récents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {students.slice(0, 6).map((student) => (
                  <button
                    key={student._id}
                    onClick={() => setSelectedStudentId(student._id)}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name?.charAt(0)?.toUpperCase() || 'E'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{student.name}</p>
                      {student.email && (
                        <p className="text-sm text-gray-500 truncate">{student.email}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message si aucun étudiant */}
          {students.length === 0 && !loading && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun étudiant trouvé</h3>
              <p className="text-gray-600 mb-4">Il n'y a actuellement aucun étudiant dans la base de données.</p>
              <button
                onClick={handleRefreshStudents}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Affichage d'erreur pour le chargement des étudiants */}
          {error && students.length === 0 && (
            <div className="text-center py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">Erreur de chargement</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Interface de chat */}
        {selectedStudentId && senderId && (
          <div>
            {/* Header du chat actif */}
            <div className="bg-white rounded-t-xl shadow-lg p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getSelectedStudentName().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Conversation avec {getSelectedStudentName()}
                    </h3>
                    <p className="text-sm text-gray-600">En ligne</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudentId('')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Fermer le chat"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Composant de chat */}
            <div className="shadow-lg rounded-b-xl overflow-hidden">
              {console.log("🚀 Rendu de Chats avec:", { senderId, selectedStudentId })}
              <Chats
                role="teacher"
                senderId={senderId}
                receiverId={selectedStudentId}
              />
            </div>
          </div>
        )}

        {/* Message d'information si aucun chat actif */}
        {!selectedStudentId && students.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Sélectionnez un étudiant pour commencer
            </h3>
            <p className="text-gray-600">
              Choisissez un étudiant dans la liste ci-dessus pour démarrer une conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};