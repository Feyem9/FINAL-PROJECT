import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Tcourses = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    level: '',
    category: '',
    amount: '',
    media: 'video',
    teacher_id: '',
  });

  // Define databaseUri
  const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI || 'http://localhost:3000';

  // Get user data
  const teacherData = JSON.parse(localStorage.getItem('teacher') || '{}');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
  const teacherId = teacherData?._id || '';
  const userId = userData?._id || '';
  const userRole = userData?.role || teacherData?.role || adminData?.role || '';
  const currentUserId = teacherData?._id || userId;


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${databaseUri}/course/all`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [databaseUri]);

  useEffect(() => {
    if (selectedCourse && showCreateForm) {
      setNewCourse({
        title: selectedCourse.title || '',
        description: selectedCourse.description || '',
        amount: selectedCourse.amount || '',
        level: selectedCourse.level || 'beginner',
        media: selectedCourse.media || 'video',
        category: selectedCourse.category || '',
        teacher_id: selectedCourse.teacher_id || '',
      });
    }
  }, [selectedCourse, showCreateForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    if (name === 'file') {
      setFile(e.target.files[0]);
    } else if (name === 'image') {
      setImage(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setNewCourse({
      title: '',
      description: '',
      amount: '',
      level: 'beginner',
      media: 'video',
      category: '',
      teacher_id: '',
    });
    setFile(null);
    setImage(null);
    setSelectedCourse(null);
    setError(null);
  };

  const handleCreateCourse = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    setError(null);

    // Use the already defined currentUserId and userRole
    if (!currentUserId || !userRole) {
      setError('Utilisateur non connecté. Veuillez vous reconnecter.');
      return;
    }

    // Validation des champs requis
    const { title, description, amount: amountRaw, level, media, category, teacher_id } = newCourse;
    if (!title || !description || !amountRaw || !level || !media || !category) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Conversion amount en nombre
    const amount = Number(amountRaw);
    if (isNaN(amount) || amount <= 0) {
      setError('Veuillez entrer un montant valide supérieur à 0.');
      return;
    }

    // Préparer FormData pour l'envoi
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('amount', amount);
    formData.append('level', level);
    formData.append('media', media);
    formData.append('category', category);
    formData.append('user_id', currentUserId);
    formData.append('role', userRole);
    
    // Add teacher_id if user is admin
    if (userRole === 'admin' && teacher_id) {
      formData.append('teacher_id', teacher_id);
    }

    // Fichiers
    if (file) formData.append('mediaFile', file);
    if (image) formData.append('imageFile', image);

    try {
      const response = await axios.post(`${databaseUri}/course/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCourses((prev) => [...prev, response.data]);
      resetForm();
      setShowCreateForm(false);

    } catch (error) {
      console.error('Error creating course:', error);
      setError(`Erreur lors de la création du cours : ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateCourse = async (courseId) => {
    setError(null);

    // Use the already defined currentUserId and userRole
    if (!currentUserId || !userRole) {
      setError('Utilisateur non connecté. Veuillez vous reconnecter.');
      return;
    }

    const { title, description, amount: amountRaw, level, media, category } = newCourse;
    if (!title || !description || !amountRaw || !level || !media || !category) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const amount = Number(amountRaw);
    if (isNaN(amount) || amount <= 0) {
      setError('Veuillez entrer un montant valide supérieur à 0.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('amount', amount);
    formData.append('level', level);
    formData.append('media', media);
    formData.append('category', category);
    formData.append('user_id', currentUserId);
    formData.append('role', userRole);

    if (file) formData.append('files', file);
    if (image) formData.append('files', image);

    try {
      const response = await axios.put(`${databaseUri}/course/update/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCourses((prev) =>
        prev.map(course => course._id === courseId ? response.data : course)
      );
      setSelectedCourse(response.data);
      resetForm();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error updating course:', error);
      setError(`Erreur lors de la mise à jour : ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`${databaseUri}/course/delete/${courseId}`);
      setCourses((prev) => prev.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedCourse(null);
    setViewMode('grid');
  };

  // Filtrage des cours
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || course.level === filter;
    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    const matchesType = !typeFilter || course.media === typeFilter;
    
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'published' && course.status !== 'inactive' && (course.user_id === currentUserId || course.teacher_id === currentUserId)) ||
      (activeTab === 'draft' && course.status === 'inactive' && (course.user_id === currentUserId || course.teacher_id === currentUserId));
    
    return matchesSearch && matchesFilter && matchesCategory && matchesType && matchesTab;
  });

  // Filter published courses by creator ID
  const publishedCoursesByCreator = courses.filter(course =>
    course.status !== 'inactive' && (course.user_id === currentUserId || course.teacher_id === currentUserId)
  );

  // Liste unique des catégories et types
  const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
  const mediaTypes = [...new Set(courses.map(c => c.media).filter(Boolean))];

  // Function to render media based on type
  const renderMedia = (course) => {
    const fileUrl = course.fileUrl ?
      (course.fileUrl.startsWith('http') ? course.fileUrl : `${databaseUri}${course.fileUrl}`) :
      null;

    if (!fileUrl) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No file available for this course</p>
          </div>
        </div>
      );
    }

    if (course.media === 'video') {
      return (
        <div className="space-y-4">
          <div className="relative pt-[56.25%]">
            <video
              controls
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              title={course.title}
            >
              <source src={fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex justify-center">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Watch Video
            </a>
          </div>
        </div>
      );
    } else if (course.media === 'pdf') {
      return (
        <div className="space-y-4">
          <div className="relative pt-[130%]">
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="absolute top-0 left-0 w-full h-full rounded-xl border"
              title={course.title}
              frameBorder="0"
            ></iframe>
          </div>

          <div className="flex justify-center space-x-4">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View PDF
            </a>
            <a
              href={fileUrl}
              download
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          </div>
        </div>
      );
    } else if (course.media === 'audio') {
      return (
        <div className="space-y-4">
          <div className="w-full p-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl">
            <audio controls className="w-full">
              <source src={fileUrl} type="audio/mpeg" />
              <source src={fileUrl} type="audio/wav" />
              <source src={fileUrl} type="audio/ogg" />
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="flex justify-center">
            <a
              href={fileUrl}
              download
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Audio
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
        <div className="text-center text-gray-500">
          <p>Unsupported media type: {course.media}</p>
        </div>
      </div>
    );
  };

  // Render course detail view
  if (viewMode === 'detail' && selectedCourse) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center text-orange-600 hover:text-orange-800 mr-4"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Courses
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{selectedCourse.title}</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {renderMedia(selectedCourse)}
              </div>
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Course Details</h2>
                  <p className="text-gray-600 mb-4">{selectedCourse.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-semibold">{selectedCourse.level}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-semibold">{selectedCourse.category}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold">${selectedCourse.amount}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Media Type</p>
                      <p className="font-semibold capitalize">{selectedCourse.media}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedCourse(selectedCourse);
                      setShowCreateForm(true);
                    }}
                    className="flex-1 bg-orange-100 text-orange-800 px-4 py-2 rounded-xl font-medium hover:bg-orange-200 transition-colors"
                  >
                    Edit Course
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(selectedCourse._id)}
                    className="flex-1 bg-red-100 text-red-800 px-4 py-2 rounded-xl font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ajoute cette constante après avoir récupéré les cours et l'id utilisateur
  // const currentUserId = teacherId || userId;
  const userCourses = courses.filter(
    c => c.user_id === currentUserId || c.teacher_id === currentUserId
  );
  const publishedCourses = userCourses.filter(c => c.status !== 'inactive');
  const draftCourses = userCourses.filter(c => c.status === 'inactive');
  const userCoursesCount = userCourses.length;

  // Fonction pour vérifier si le formulaire est valide
  const isFormValid = () => {
    const { title, description, amount, level, media, category } = newCourse;
    return title.trim() && 
           description.trim() && 
           amount && 
           level && 
           media && 
           category;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Courses</h1>
            <p className="text-gray-600">Manage and create your music courses</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-md"
          >
            Create New Course
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">My Courses</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{userCoursesCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">My Published</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{publishedCourses.length}</p>
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
              <p className="text-gray-500 text-sm font-medium">My Drafts</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{draftCourses.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">$2,480</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="All">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="piano">Piano</option>
            <option value="flute">Flute</option>
            <option value="violon">Violon</option>
            <option value="baterie">Baterie</option>
          </select>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="audio">Audio</option>
          </select>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCourse ? "Update Course" : "Create New Course"}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <form onSubmit={e => {
                e.preventDefault();
                if (selectedCourse) {
                  handleUpdateCourse(selectedCourse._id);
                } else {
                  handleCreateCourse(e);
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Course Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newCourse.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Course Amount ($)</label>
                    <input
                      type="number"
                      name="amount"
                      value={newCourse.amount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      value={newCourse.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="piano">Piano</option>
                      <option value="flute">Flute</option>
                      <option value="violon">Violon</option>
                      <option value="baterie">Baterie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Level</label>
                    <select
                      name="level"
                      value={newCourse.level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Media Type</label>
                    <select
                      name="media"
                      value={newCourse.media}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                      <option value="audio">Audio</option>
                    </select>
                  </div>

                  {userRole === 'admin' && (
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Teacher ID</label>
                      <input
                        type="text"
                        name="teacher_id"
                        placeholder="Enter the teacher's ID"
                        value={newCourse.teacher_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={newCourse.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    ></textarea>
                  </div>

                  {/* Upload Media / Image */}
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Upload Media</label>
                        <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">MP4, PDF, MP3 up to 10MB</p>
                            {file && (
                              <p className="text-xs text-green-600 mt-1">File selected: {file.name}</p>
                            )}
                          </div>
                          <input type="file" name="file" className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Upload Course Image (Optional)</label>
                        <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
                            {image && (
                              <p className="text-xs text-green-600 mt-1">Image selected: {image.name}</p>
                            )}
                          </div>
                          <input type="file" name="image" className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-4 font-medium ${activeTab === 'all'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`py-2 px-4 font-medium ${activeTab === 'published'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Published
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`py-2 px-4 font-medium ${activeTab === 'draft'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {course.image ? (
                <img
                  src={`${databaseUri}${course.image}`}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-orange-400 to-red-500"></div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'Published' || course.status !== 'inactive'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {course.status === 'inactive' ? 'Draft' : 'Published'}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                {course.category}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description || "No description available for this course."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {course.level}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full capitalize">
                  {course.media}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>8 lessons</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{course.views || 0} views</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>24 students</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-lg font-bold text-gray-800">${course.amount || 0}</div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    onClick={() => handleViewCourse(course)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 transition-colors"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowCreateForm(true);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Browse by Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Browse by Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full ${categoryFilter === cat ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {cat}
            </button>
          ))}
          <button onClick={() => setCategoryFilter('')} className="px-3 py-1 rounded-full bg-gray-300 text-gray-700">All</button>
        </div>
      </div>

      {/* Browse by Types */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Browse by Types</h2>
        <div className="flex flex-wrap gap-2">
          {mediaTypes.map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-full capitalize ${typeFilter === type ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {type}
            </button>
          ))}
          <button onClick={() => setTypeFilter('')} className="px-3 py-1 rounded-full bg-gray-300 text-gray-700">All</button>
        </div>
      </div>
    </div>
  );
};