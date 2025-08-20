// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// export default function Course() {

//     const { id } = useParams(); // si `id` existe → édition

//     // Define databaseUri in a scope accessible to all functions
//     const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI || 'http://localhost:3000';

//     const [courses, setCourses] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [newCourse, setNewCourse] = useState({
//         title: '',
//         description: '',
//         amount: '',
//         level: '',
//         media: 'video',
//         category: '',
//         teacher_id: '',
//     });
//     const [file, setFile] = useState(null);
//     const [image, setImage] = useState(null);
//     const [open, setOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filter, setFilter] = useState('All');
//     const [teacherFilter, setTeacherFilter] = useState('');
//     const [selectedCourse, setSelectedCourse] = useState(null);
//     const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'
//     const [error, setError] = useState(null);

//     // Récupère l'id du teacher depuis le localStorage (à adapter selon ton auth)
//     const teacherData = JSON.parse(localStorage.getItem('teacher') || '{}');
//     const userData = JSON.parse(localStorage.getItem('user') || '{}');
//     const teacherId = teacherData?._id || '';
//     const userId = userData?._id || '';
//     const userRole = userData?.role || '';



//     useEffect(() => {
//         if (id) {
//             axios.get(`http://localhost:3000/courses/${id}`)
//                 .then(res => setSelectedCourse(res.data))
//                 .catch(err => console.error(err));
//         }

//         if (selectedCourse) {
//             setNewCourse({
//                 title: selectedCourse.title || '',
//                 description: selectedCourse.description || '',
//                 amount: selectedCourse.amount || '',
//                 level: selectedCourse.level || 'beginner',
//                 media: selectedCourse.media || 'video',
//                 category: selectedCourse.category || '',
//                 teacher_id: selectedCourse.teacher_id || '',
//             });
//         }
//         const fetchCourses = async () => {
//             try {
//                 const response = await axios.get(`${databaseUri}/course/all`);
//                 setCourses(response.data);
//             } catch (error) {
//                 console.error('Error fetching courses:', error);
//             }
//         };
//         fetchCourses();
//     }, [selectedCourse, id, databaseUri]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewCourse((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         const { name } = e.target;
//         if (name === 'file') {
//             setFile(e.target.files[0]);
//         } else if (name === 'image') {
//             setImage(e.target.files[0]);
//         }
//     };

//     const handleCreateCourse = async () => {
//         setLoading(true);
//         setError(null);

//         // Récupérer l'utilisateur connecté (admin ou teacher)
//         //   const user = JSON.parse(localStorage.getItem('user') || '{}');
//         const teacher = JSON.parse(localStorage.getItem('teacher') || '{}');
//         const admin = JSON.parse(localStorage.getItem('admin') || '{}');
//         console.log('Teacher:', teacher);
//         console.log('Admin:', admin);

//         const user = teacher._id ? teacher : admin._id ? admin : null;
//         const userId = user._id;
//         console.log('User ID:', userId);
//         const userRole = user.role; // 'admin' ou 'teacher'
//         console.log('User Role:', userRole);

//         if (!userId || !userRole) {
//             setError('Utilisateur non connecté. Veuillez vous reconnecter.');
//             setLoading(false);
//             return;
//         }

//         // Validation des champs requis
//         const { title, description, amount: amountRaw, level, media, category } = newCourse;
//         if (!title || !description || !amountRaw || !level || !media || !category) {
//             setError('Veuillez remplir tous les champs obligatoires.');
//             setLoading(false);
//             return;
//         }

//         // Conversion amount en nombre
//         const amount = Number(amountRaw);
//         if (isNaN(amount) || amount <= 0) {
//             setError('Veuillez entrer un montant valide supérieur à 0.');
//             setLoading(false);
//             return;
//         }

//         // Préparer FormData pour l'envoi
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('description', description);
//         formData.append('amount', amount);
//         formData.append('level', level);
//         formData.append('media', media);
//         formData.append('category', category);

//         // Champs requis par le nouveau DTO
//         formData.append('user_id', userId);
//         formData.append('role', userRole); // 'teacher' ou 'admin'


//         // Fichiers
//         if (file) formData.append('files', file);
//         if (image) formData.append('files', image);

//         try {
//             const response = await axios.post(`${databaseUri}/course/create`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             console.log('Course created:', response.data);
//             setCourses((prev) => [...prev, response.data]);
//             setNewCourse({
//                 title: '',
//                 description: '',
//                 amount: '',
//                 level: 'beginner',
//                 media: 'video',
//                 category: '',
//             });
//             setFile(null);
//             setImage(null);
//             setOpen(false);

//         } catch (error) {
//             console.error('Error creating course:', error);
//             console.error('Error response:', error.response);
//             for (let [key, value] of formData.entries()) {
//                 console.log(key, value);
//             }
//             setError(`Erreur lors de la création du cours : ${error.response?.data?.message || error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteCourse = async (courseId) => {
//         try {
//             await axios.delete(`${databaseUri}/course/delete/${courseId}`);
//             setCourses((prev) => prev.filter(course => course._id !== courseId));
//         } catch (error) {
//             console.error('Error deleting course:', error);
//         }
//     };

//     const handleUpdateCourse = async (courseId, updatedData) => {
//         console.log('Updating course:', courseId, updatedData);
//         try {
//             const response = await axios.put(`${databaseUri}/course/update/${courseId}`, updatedData);
//             setCourses((prev) =>
//                 prev.map(course => course._id === courseId ? response.data : course)
//             );
//             setSelectedCourse(response.data);
//         } catch (error) {
//             console.error('Error updating course:', error);
//         }
//     };

//     const handleViewCourse = (course) => {
//         setSelectedCourse(course);
//         setViewMode('detail');
//     };

//     const handleBackToList = () => {
//         setSelectedCourse(null);
//         setViewMode('grid');
//     };

//     // Ajout de la logique de filtrage et de recherche
//     const filteredCourses = courses.filter(course => {
//         const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesFilter = filter === 'All' || course.level === filter;
//         const matchesTeacher = !teacherFilter || course.teacher_id === teacherFilter;
//         return matchesSearch && matchesFilter && matchesTeacher;
//     });

//     // Function to render media based on type
//     const renderMedia = (course) => {
//         if (course.media === 'video') {
//             return (
//                 <div className="relative pt-[56.25%]">
//                     <iframe
//                         src={course.fileUrl}
//                         className="absolute top-0 left-0 w-full h-full rounded-xl"
//                         title={course.title}
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                     ></iframe>
//                 </div>
//             );
//         } else if (course.media === 'pdf') {
//             return (
//                 <div className="relative pt-[130%]">
//                     <iframe
//                         src={course.fileUrl}
//                         className="absolute top-0 left-0 w-full h-full rounded-xl"
//                         title={course.title}
//                         frameBorder="0"
//                     ></iframe>
//                 </div>
//             );
//         } else if (course.media === 'audio') {
//             return (
//                 <div className="w-full">
//                     <audio controls className="w-full">
//                         <source src={course.fileUrl} type="audio/mpeg" />
//                         Your browser does not support the audio element.
//                     </audio>
//                 </div>
//             );
//         }
//         return <div>Unsupported media type</div>;
//     };

//     // Render course detail view
//     if (viewMode === 'detail' && selectedCourse) {
//         return (
//             <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="flex items-center mb-6">
//                         <button
//                             onClick={handleBackToList}
//                             className="flex items-center text-green-600 hover:text-green-800 mr-4"
//                         >
//                             <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                             </svg>
//                             Back to Courses
//                         </button>
//                         <h1 className="text-3xl font-bold text-gray-800">{selectedCourse.title}</h1>
//                     </div>

//                     <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                             <div className="lg:col-span-2">
//                                 {renderMedia(selectedCourse)}
//                             </div>
//                             <div>
//                                 <div className="mb-6">
//                                     <h2 className="text-xl font-bold text-gray-800 mb-2">Course Details</h2>
//                                     <p className="text-gray-600 mb-4">{selectedCourse.description}</p>

//                                     <div className="grid grid-cols-2 gap-4 mb-4">
//                                         <div className="bg-gray-50 p-4 rounded-xl">
//                                             <p className="text-sm text-gray-500">Level</p>
//                                             <p className="font-semibold">{selectedCourse.level}</p>
//                                         </div>
//                                         <div className="bg-gray-50 p-4 rounded-xl">
//                                             <p className="text-sm text-gray-500">Category</p>
//                                             <p className="font-semibold">{selectedCourse.category}</p>
//                                         </div>
//                                         <div className="bg-gray-50 p-4 rounded-xl">
//                                             <p className="text-sm text-gray-500">Price</p>
//                                             <p className="font-semibold">${selectedCourse.amount}</p>
//                                         </div>
//                                         <div className="bg-gray-50 p-4 rounded-xl">
//                                             <p className="text-sm text-gray-500">Media Type</p>
//                                             <p className="font-semibold capitalize">{selectedCourse.media}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="flex space-x-3">
//                                     <button
//                                         onClick={() => {
//                                             setNewCourse(selectedCourse);
//                                             setOpen(true);
//                                         }}
//                                         className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-xl font-medium hover:bg-green-200 transition-colors"
//                                     >
//                                         Edit Course
//                                     </button>
//                                     <button
//                                         onClick={() => handleDeleteCourse(selectedCourse._id)}
//                                         className="flex-1 bg-red-100 text-red-800 px-4 py-2 rounded-xl font-medium hover:bg-red-200 transition-colors"
//                                     >
//                                         Delete Course
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header Section */}
//                 <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-800 mb-2">Courses Management</h1>
//                         <p className="text-gray-600">Manage your music courses and learning materials</p>
//                     </div>
//                     <button
//                         onClick={() => setOpen(true)}
//                         className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
//                     >
//                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                         New Course
//                     </button>
//                 </header>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-white rounded-2xl p-6 shadow-sm">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-gray-500 text-sm font-medium">Total Courses</p>
//                                 <p className="text-2xl font-bold text-gray-800 mt-1">{courses.length}</p>
//                             </div>
//                             <div className="p-3 bg-green-100 rounded-full">
//                                 <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-2xl p-6 shadow-sm">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-gray-500 text-sm font-medium">Active Courses</p>
//                                 <p className="text-2xl font-bold text-gray-800 mt-1">{courses.filter(c => c.status !== 'inactive').length}</p>
//                             </div>
//                             <div className="p-3 bg-blue-100 rounded-full">
//                                 <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-2xl p-6 shadow-sm">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-gray-500 text-sm font-medium">Students</p>
//                                 <p className="text-2xl font-bold text-gray-800 mt-1">142</p>
//                             </div>
//                             <div className="p-3 bg-purple-100 rounded-full">
//                                 <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-2xl p-6 shadow-sm">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-gray-500 text-sm font-medium">Revenue</p>
//                                 <p className="text-2xl font-bold text-gray-800 mt-1">$2,480</p>
//                             </div>
//                             <div className="p-3 bg-yellow-100 rounded-full">
//                                 <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Search and Filter Section */}
//                 <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 md:space-y-0 md:space-x-6">
//                     <div className="relative w-full md:w-1/2">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                             </svg>
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Search courses..."
//                             value={searchTerm}
//                             onChange={e => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         />
//                     </div>
//                     <div className="flex flex-wrap gap-4 w-full md:w-auto">
//                         <select
//                             value={filter}
//                             onChange={e => setFilter(e.target.value)}
//                             className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         >
//                             <option value="All">All Levels</option>
//                             <option value="beginner">Beginner</option>
//                             <option value="intermediate">Intermediate</option>
//                             <option value="advanced">Advanced</option>
//                         </select>
//                         <select className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
//                             <option value="">All Categories</option>
//                             <option value="piano">Piano</option>
//                             <option value="flute">Flute</option>
//                             <option value="violon">Violon</option>
//                             <option value="baterie">Baterie</option>
//                         </select>
//                         <input
//                             type="text"
//                             placeholder="Filter by teacher ID"
//                             value={teacherFilter}
//                             onChange={e => setTeacherFilter(e.target.value)}
//                             className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         />
//                     </div>
//                 </div>

//                 {/* Error message */}
//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//                         <strong className="font-bold">Error: </strong>
//                         <span className="block sm:inline">{error}</span>
//                     </div>
//                 )}

//                 {/* Courses Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredCourses.map((course) => (
//                         <div key={course._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
//                             {/* Course Image */}
//                             <div className="h-48 relative">
//                                 {course.image ? (
//                                     <img
//                                         src={`${databaseUri}${course.image}`}
//                                         alt={course.title}
//                                         className="w-full h-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
//                                 )}
//                                 <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
//                                     {course.level}
//                                 </div>
//                                 <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
//                                     {course.category}
//                                 </div>
//                             </div>

//                             {/* Course Content */}
//                             <div className="p-6">
//                                 <div className="flex justify-between items-start mb-3">
//                                     <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
//                                     <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
//                                         Active
//                                     </span>
//                                 </div>

//                                 <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                                     {course.description || "No description available for this course."}
//                                 </p>

//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="flex items-center space-x-4 text-sm text-gray-500">
//                                         <div className="flex items-center">
//                                             <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                             </svg>
//                                             <span>8 lessons</span>
//                                         </div>
//                                         <div className="flex items-center">
//                                             <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                                             </svg>
//                                             <span>24 students</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//                                     <div className="text-lg font-bold text-gray-800">${course.amount || 0}</div>
//                                     <div className="flex space-x-2">
//                                         <button
//                                             className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
//                                             onClick={() => handleViewCourse(course)}
//                                         >
//                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                             </svg>
//                                         </button>
//                                         <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
//                                             onClick={() => {
//                                                 setNewCourse(selectedCourse);
//                                                 setOpen(true);
//                                             }}
//                                         >
//                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                                             </svg>
//                                         </button>
//                                         <button
//                                             className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
//                                             onClick={() => handleDeleteCourse(course._id)}
//                                         >
//                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                             </svg>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Modal de création / mise à jour de cours (stylisé avec Tailwind) */}
//                 {open && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-auto">
//                         <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
//                             <div className="flex justify-between items-center mb-6 flex-wrap">
//                                 <h2 className="text-2xl font-bold text-gray-800">
//                                     {selectedCourse ? "Update Course" : "Create New Course"}
//                                 </h2>
//                                 <button
//                                     onClick={() => {
//                                         setOpen(false);
//                                         setSelectedCourse(null);
//                                         setNewCourse({
//                                             title: '',
//                                             description: '',
//                                             amount: '',
//                                             level: 'beginner',
//                                             media: 'video',
//                                             category: '',
//                                             teacher_id: '',
//                                         });
//                                     }}
//                                     className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors mt-2 sm:mt-0"
//                                 >
//                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                     </svg>
//                                 </button>
//                             </div>

//                             {error && (
//                                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//                                     <strong className="font-bold">Error: </strong>
//                                     <span className="block sm:inline">{error}</span>
//                                 </div>
//                             )}

//                             <div className="space-y-5">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
//                                         <input
//                                             type="text"
//                                             name="title"
//                                             placeholder="Enter course title"
//                                             value={newCourse?.title || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Course Amount ($)</label>
//                                         <input
//                                             type="number"
//                                             name="amount"
//                                             placeholder="Enter course price"
//                                             value={newCourse?.amount || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                                         />
//                                     </div>
//                                 </div>

//                                 {userRole === 'admin' && (
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Teacher ID</label>
//                                         <input
//                                             type="text"
//                                             name="teacher_id"
//                                             placeholder="Enter the teacher's ID"
//                                             value={newCourse?.teacher_id || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                                         />
//                                     </div>
//                                 )}

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
//                                     <textarea
//                                         name="description"
//                                         placeholder="Enter course description"
//                                         value={newCourse?.description || ''}
//                                         onChange={handleInputChange}
//                                         rows="4"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                                     />
//                                 </div>

//                                 {/* Category, Level, Media Type, File/Image Upload */}
//                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                                         <select
//                                             name="category"
//                                             value={newCourse?.category || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                                         >
//                                             <option value="">Select Category</option>
//                                             <option value="piano">Piano</option>
//                                             <option value="flute">Flute</option>
//                                             <option value="violon">Violon</option>
//                                             <option value="baterie">Baterie</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
//                                         <select
//                                             name="level"
//                                             value={newCourse?.level || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                                         >
//                                             <option value="">Select Level</option>
//                                             <option value="beginner">Beginner</option>
//                                             <option value="intermediate">Intermediate</option>
//                                             <option value="advanced">Advanced</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
//                                         <select
//                                             name="media"
//                                             value={newCourse?.media || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
//                                         >
//                                             <option value="video">Video</option>
//                                             <option value="pdf">PDF</option>
//                                             <option value="audio">Audio</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 {/* Upload Media / Image */}
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Upload Media</label>
//                                         <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition-colors">
//                                             <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                                 <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                                                 </svg>
//                                                 <p className="mb-2 text-sm text-gray-500">
//                                                     <span className="font-semibold">Click to upload</span> or drag and drop
//                                                 </p>
//                                                 <p className="text-xs text-gray-500">MP4, PDF, MP3 up to 10MB</p>
//                                             </div>
//                                             <input type="file" name="file" className="hidden" onChange={handleFileChange} />
//                                         </label>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Upload Course Image (Optional)</label>
//                                         <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition-colors">
//                                             <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                                 <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                                 </svg>
//                                                 <p className="mb-2 text-sm text-gray-500">
//                                                     <span className="font-semibold">Click to upload</span> or drag and drop
//                                                 </p>
//                                                 <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
//                                             </div>
//                                             <input type="file" name="image" className="hidden" onChange={handleFileChange} />
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col sm:flex-row justify-end mt-8 space-y-3 sm:space-y-0 sm:space-x-3">
//                                 <button
//                                     onClick={() => {
//                                         setOpen(false);
//                                         setSelectedCourse(null);
//                                     }}
//                                     className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         if (selectedCourse) {
//                                             handleUpdateCourse(selectedCourse._id, newCourse);
//                                         } else {
//                                             handleCreateCourse();
//                                         }
//                                     }}
//                                     disabled={loading}
//                                     className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {loading ? (selectedCourse ? 'Updating...' : 'Creating...') : selectedCourse ? 'Update Course' : 'Create Course'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}


//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Course() {

    const { id } = useParams(); // si `id` existe → édition

    // Define databaseUri in a scope accessible to all functions
    const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI || 'http://localhost:3000';

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        amount: '',
        level: '',
        media: 'video',
        category: '',
        teacher_id: '',
    });
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [teacherFilter, setTeacherFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'
    const [error, setError] = useState(null);

    // Récupère l'id du teacher depuis le localStorage (à adapter selon ton auth)
    const teacherData = JSON.parse(localStorage.getItem('teacher') || '{}');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    const teacherId = teacherData?._id || '';
    const userId = userData?._id || '';
    const userRole = userData?.role || teacherData?.role || adminData?.role || '';

    useEffect(() => {
        if (id) {
            axios.get(`${databaseUri}/course/${id}`)
                .then(res => setSelectedCourse(res.data))
                .catch(err => console.error(err));
        }
    }, [id, databaseUri]);

    useEffect(() => {
        if (selectedCourse && open) {
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
    }, [selectedCourse, open]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse((prev) => ({ ...prev, [name]: value }));
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

    const handleCreateCourse = async () => {
        setLoading(true);
        setError(null);

        // Récupérer l'utilisateur connecté (admin ou teacher)
        const teacher = JSON.parse(localStorage.getItem('teacher') || '{}');
        const admin = JSON.parse(localStorage.getItem('admin') || '{}');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Teacher:', teacher);
        console.log('Admin:', admin);
        console.log('User:', user);

        const currentUser = teacher._id ? teacher : admin._id ? admin : user._id ? user : null;
        const currentUserId = currentUser?._id;
        console.log('User ID:', currentUserId);
        const currentUserRole = currentUser?.role; // 'admin' ou 'teacher'
        console.log('User Role:', currentUserRole);

        if (!currentUserId || !currentUserRole) {
            setError('Utilisateur non connecté. Veuillez vous reconnecter.');
            setLoading(false);
            return;
        }

        // Validation des champs requis
        const { title, description, amount: amountRaw, level, media, category } = newCourse;
        if (!title || !description || !amountRaw || !level || !media || !category) {
            setError('Veuillez remplir tous les champs obligatoires.');
            setLoading(false);
            return;
        }

        // Conversion amount en nombre
        const amount = Number(amountRaw);
        if (isNaN(amount) || amount <= 0) {
            setError('Veuillez entrer un montant valide supérieur à 0.');
            setLoading(false);
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

        // Champs requis par le nouveau DTO
        formData.append('user_id', currentUserId);
        formData.append('role', currentUserRole); // 'teacher' ou 'admin'

        // Fichiers
        if (file) formData.append('files', file);
        if (image) formData.append('files', image);

        try {
            const response = await axios.post(`${databaseUri}/course/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Course created:', response.data);
            setCourses((prev) => [...prev, response.data]);
            resetForm();
            setOpen(false);

        } catch (error) {
            console.error('Error creating course:', error);
            console.error('Error response:', error.response);
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            setError(`Erreur lors de la création du cours : ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
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

    const handleUpdateCourse = async (courseId) => {
        setLoading(true);
        setError(null);

        // Récupérer l'utilisateur connecté (admin ou teacher)
        const teacher = JSON.parse(localStorage.getItem('teacher') || '{}');
        const admin = JSON.parse(localStorage.getItem('admin') || '{}');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const currentUser = teacher._id ? teacher : admin._id ? admin : user._id ? user : null;
        const currentUserId = currentUser?._id;
        const currentUserRole = currentUser?.role;

        if (!currentUserId || !currentUserRole) {
            setError('Utilisateur non connecté. Veuillez vous reconnecter.');
            setLoading(false);
            return;
        }

        // Validation des champs requis
        const { title, description, amount: amountRaw, level, media, category } = newCourse;
        if (!title || !description || !amountRaw || !level || !media || !category) {
            setError('Veuillez remplir tous les champs obligatoires.');
            setLoading(false);
            return;
        }

        // Conversion amount en nombre
        const amount = Number(amountRaw);
        if (isNaN(amount) || amount <= 0) {
            setError('Veuillez entrer un montant valide supérieur à 0.');
            setLoading(false);
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
        formData.append('role', currentUserRole);

        // Fichiers
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
            setOpen(false);
        } catch (error) {
            console.error('Error updating course:', error);
            setError(`Erreur lors de la mise à jour : ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
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

    // Ajout de la logique de filtrage et de recherche
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || course.level === filter;
        const matchesTeacher = !teacherFilter || course.teacher_id === teacherFilter;
        const matchesCategory = !categoryFilter || course.category === categoryFilter;
        return matchesSearch && matchesFilter && matchesTeacher && matchesCategory;
    });

    // Function to render media based on type
    const renderMedia = (course) => {
        if (course.media === 'video') {
            return (
                <div className="relative pt-[56.25%]">
                    <iframe
                        src={course.fileUrl}
                        className="absolute top-0 left-0 w-full h-full rounded-xl"
                        title={course.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            );
        } else if (course.media === 'pdf') {
            return (
                <div className="relative pt-[130%]">
                    <iframe
                        src={course.fileUrl}
                        className="absolute top-0 left-0 w-full h-full rounded-xl"
                        title={course.title}
                        frameBorder="0"
                    ></iframe>
                </div>
            );
        } else if (course.media === 'audio') {
            return (
                <div className="w-full">
                    <audio controls className="w-full">
                        <source src={course.fileUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            );
        }
        return <div>Unsupported media type</div>;
    };

    // Render course detail view
    if (viewMode === 'detail' && selectedCourse) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={handleBackToList}
                            className="flex items-center text-green-600 hover:text-green-800 mr-4"
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
                                            setOpen(true);
                                        }}
                                        className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-xl font-medium hover:bg-green-200 transition-colors"
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

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Courses Management</h1>
                        <p className="text-gray-600">Manage your music courses and learning materials</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setOpen(true);
                        }}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Course
                    </button>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{courses.length}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Active Courses</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{courses.filter(c => c.status !== 'inactive').length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Students</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">142</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="All">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <select 
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            <option value="piano">Piano</option>
                            <option value="flute">Flute</option>
                            <option value="violon">Violon</option>
                            <option value="baterie">Baterie</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Filter by teacher ID"
                            value={teacherFilter}
                            onChange={e => setTeacherFilter(e.target.value)}
                            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                            {/* Course Image */}
                            <div className="h-48 relative">
                                {course.image ? (
                                    <img
                                        src={`${databaseUri}${course.image}`}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                                )}
                                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                                    {course.level}
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                                    {course.category}
                                </div>
                            </div>

                            {/* Course Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                        Active
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {course.description || "No description available for this course."}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>8 lessons</span>
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
                                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                setOpen(true);
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

                {/* Modal de création / mise à jour de cours (stylisé avec Tailwind) */}
                {open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-auto">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                            <div className="flex justify-between items-center mb-6 flex-wrap">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedCourse ? "Update Course" : "Create New Course"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors mt-2 sm:mt-0"
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

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Enter course title"
                                            value={newCourse?.title || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Amount ($)</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="Enter course price"
                                            value={newCourse?.amount || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>

                                {userRole === 'admin' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Teacher ID</label>
                                        <input
                                            type="text"
                                            name="teacher_id"
                                            placeholder="Enter the teacher's ID"
                                            value={newCourse?.teacher_id || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter course description"
                                        value={newCourse?.description || ''}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Category, Level, Media Type, File/Image Upload */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={newCourse?.category || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="piano">Piano</option>
                                            <option value="flute">Flute</option>
                                            <option value="violon">Violon</option>
                                            <option value="baterie">Baterie</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                                        <select
                                            name="level"
                                            value={newCourse?.level || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        >
                                            <option value="">Select Level</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                                        <select
                                            name="media"
                                            value={newCourse?.media || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        >
                                            <option value="video">Video</option>
                                            <option value="pdf">PDF</option>
                                            <option value="audio">Audio</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Upload Media / Image */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Media</label>
                                        <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">MP4, PDF, MP3 up to 10MB</p>
                                            </div>
                                            <input type="file" name="file" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Course Image (Optional)</label>
                                        <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
                                            </div>
                                            <input type="file" name="image" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end mt-8 space-y-3 sm:space-y-0 sm:space-x-3">
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        resetForm();
                                    }}
                                    className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                
                                <button
                                    onClick={() => {
                                        if (selectedCourse) {
                                            handleUpdateCourse(selectedCourse._id);
                                        } else {
                                            handleCreateCourse();
                                        }
                                    }}
                                    disabled={loading}
                                    className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (selectedCourse ? 'Updating...' : 'Creating...') : selectedCourse ? 'Update Course' : 'Create Course'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}