// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export const Scourse = () => {
//   const [activeTab, setActiveTab] = useState('enrolled');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [youtubeSearchTerm, setYoutubeSearchTerm] = useState('');
//   const [availableCourses, setAvailableCourses] = useState([]);
//   const [youtubeVideos, setYoutubeVideos] = useState([]);
//   const [levelFilter, setLevelFilter] = useState('');
//   const [typeFilter, setTypeFilter] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showCourseViewer, setShowCourseViewer] = useState(false);

//   // État pour les cours inscrits - utiliser useState pour permettre les modifications
//   const [enrolledCourses, setEnrolledCourses] = useState([
   
//   ]);

//   const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

//   // Fonction pour s'inscrire à un cours
//   const handleEnrollCourse = (course) => {
//     // Vérifier si le cours n'est pas déjà inscrit
//     const isAlreadyEnrolled = enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id);
    
//     if (!isAlreadyEnrolled) {
//       const newEnrolledCourse = {
//         ...course,
//         progress: 0,
//         nextLesson: 'Introduction',
//         nextLessonDate: 'Available now',
//         viewed: false,
//         courseContent: {
//           lessons: [
//             {
//               id: 1,
//               title: `${course.title} - Introduction`,
//               type: 'pdf',
//               url: `/docs/${course.title.toLowerCase().replace(/\s+/g, '-')}-intro.pdf`,
//               pages: 15
//             },
//             {
//               id: 2,
//               title: `${course.title} - Video Guide`,
//               type: 'video',
//               url: `/videos/${course.title.toLowerCase().replace(/\s+/g, '-')}-guide.mp4`,
//               duration: '25:00'
//             }
//           ]
//         }
//       };
      
//       setEnrolledCourses(prev => [...prev, newEnrolledCourse]);
//       alert(`Vous êtes maintenant inscrit au cours : ${course.title}`);
//     } else {
//       alert('Vous êtes déjà inscrit à ce cours !');
//     }
//   };

//   // Fonction pour ouvrir le visualiseur de cours
//   const handleViewCourse = (course) => {
//     setSelectedCourse(course);
//     setShowCourseViewer(true);
//   };

//   // Fonction pour télécharger un fichier
//   const handleDownloadFile = (lesson) => {
//     // Créer un lien de téléchargement simulé
//     const link = document.createElement('a');
//     link.href = lesson.url;
//     link.download = lesson.title;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Composant pour le visualiseur de cours
//   const CourseViewer = ({ course, onClose }) => {
//     const [activeLesson, setActiveLesson] = useState(course.courseContent.lessons[0]);

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
//           {/* Header */}
//           <div className="flex justify-between items-center p-6 border-b">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">{course.title}</h2>
//               <p className="text-gray-600">Instructeur : {course.instructor}</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 text-2xl"
//             >
//               ×
//             </button>
//           </div>

//           <div className="flex h-[calc(90vh-120px)]">
//             {/* Sidebar avec les leçons */}
//             <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold mb-4">Contenu du cours</h3>
//                 {course.courseContent.lessons.map((lesson) => (
//                   <div
//                     key={lesson.id}
//                     className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
//                       activeLesson.id === lesson.id
//                         ? 'bg-amber-100 border-l-4 border-amber-500'
//                         : 'bg-white hover:bg-gray-100'
//                     }`}
//                     onClick={() => setActiveLesson(lesson)}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-medium text-gray-800">{lesson.title}</h4>
//                         <div className="flex items-center text-sm text-gray-600 mt-1">
//                           {lesson.type === 'video' && (
//                             <>
//                               <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                               </svg>
//                               {lesson.duration}
//                             </>
//                           )}
//                           {lesson.type === 'pdf' && (
//                             <>
//                               <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
//                               </svg>
//                               {lesson.pages} pages
//                             </>
//                           )}
//                           {lesson.type === 'audio' && (
//                             <>
//                               <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.9 14.2A1 1 0 014 13.4V6.6a1 1 0 01.9-.8l3.483-2.616zm7.724 1.35A7.977 7.977 0 0118 10c0 2.407-1.06 4.566-2.741 6.018l-1.228-1.228A6.013 6.013 0 0016 10a6.013 6.013 0 00-1.97-4.465l1.229-1.228z" clipRule="evenodd" />
//                               </svg>
//                               {lesson.duration}
//                             </>
//                           )}
//                         </div>
//                       </div>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDownloadFile(lesson);
//                         }}
//                         className="p-1 text-gray-500 hover:text-amber-600 transition-colors"
//                         title="Télécharger"
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Zone de contenu principal */}
//             <div className="flex-1 p-6 overflow-y-auto">
//               <div className="mb-4">
//                 <h3 className="text-xl font-bold text-gray-800 mb-2">{activeLesson.title}</h3>
//                 <div className="flex items-center justify-between">
//                   <span className={`px-3 py-1 rounded-full text-sm ${
//                     activeLesson.type === 'video' ? 'bg-red-100 text-red-800' :
//                     activeLesson.type === 'pdf' ? 'bg-blue-100 text-blue-800' :
//                     'bg-green-100 text-green-800'
//                   }`}>
//                     {activeLesson.type.toUpperCase()}
//                   </span>
//                   <button
//                     onClick={() => handleDownloadFile(activeLesson)}
//                     className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
//                   >
//                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     Télécharger
//                   </button>
//                 </div>
//               </div>

//               {/* Zone de visualisation du contenu */}
//               <div className="bg-gray-100 rounded-lg p-8 text-center min-h-96 flex items-center justify-center">
//                 {activeLesson.type === 'video' && (
//                   <div className="text-gray-600">
//                     <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                     </svg>
//                     <p className="text-lg font-medium">Lecteur vidéo</p>
//                     <p className="text-sm">Durée: {activeLesson.duration}</p>
//                     <p className="text-xs mt-2">Le lecteur vidéo serait intégré ici</p>
//                   </div>
//                 )}
//                 {activeLesson.type === 'pdf' && (
//                   <div className="text-gray-600">
//                     <svg className="w-16 h-16 mx-auto mb-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
//                     </svg>
//                     <p className="text-lg font-medium">Visualiseur PDF</p>
//                     <p className="text-sm">{activeLesson.pages} pages</p>
//                     <p className="text-xs mt-2">Le visualiseur PDF serait intégré ici</p>
//                   </div>
//                 )}
//                 {activeLesson.type === 'audio' && (
//                   <div className="text-gray-600">
//                     <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.9 14.2A1 1 0 014 13.4V6.6a1 1 0 01.9-.8l3.483-2.616z" clipRule="evenodd" />
//                     </svg>
//                     <p className="text-lg font-medium">Lecteur audio</p>
//                     <p className="text-sm">Durée: {activeLesson.duration}</p>
//                     <p className="text-xs mt-2">Le lecteur audio serait intégré ici</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Fetch available courses from database
//   useEffect(() => {
//     const fetchAvailableCourses = async () => {
//       try {
//         const response = await axios.get(`${databaseUri}/course/all`);
//         setAvailableCourses(response.data);
//       } catch (error) {
//         console.error('Error fetching available courses:', error);
//         // Fallback to mock data
//         setAvailableCourses([]);
//       }
//     };

//     fetchAvailableCourses();
//   }, []);

//   // Fetch YouTube videos
//   const fetchYoutubeVideos = async (query) => {
//     if (!query) return;

//     try {
//       const response = await axios.get(`${databaseUri}/course/search-youtube?q=${encodeURIComponent(query)}`);

//       // Transform YouTube data to match course format
//       const transformedVideos = response.data.map(video => ({
//         id: video.videoId,
//         title: video.title,
//         description: video.description,
//         image: video.thumbnail,
//         instructor: 'YouTube Instructor',
//         category: 'YouTube',
//         level: 'All Levels',
//         rating: 5,
//         students: 0,
//         price: 0,
//         isYoutubeVideo: true,
//         videoId: video.videoId
//       }));

//       setYoutubeVideos(transformedVideos);
//     } catch (error) {
//       console.error('Error fetching YouTube videos:', error);
//       setYoutubeVideos([]);
//     }
//   };

//   // Fetch YouTube videos when component mounts
//   useEffect(() => {
//     fetchYoutubeVideos('music');
//   }, []);

//   // Filter courses based on search term
//   const filteredEnrolledCourses = enrolledCourses.filter(course =>
//     (levelFilter ? course.level === levelFilter : true) &&
//     (typeFilter ? course.category === typeFilter : true) &&
//     (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const filteredAvailableCourses = availableCourses.filter(course =>
//     course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Filter YouTube videos based on search term
//   const filteredYoutubeVideos = youtubeVideos.filter(video =>
//     video.title.toLowerCase().includes(youtubeSearchTerm.toLowerCase()) ||
//     video.description.toLowerCase().includes(youtubeSearchTerm.toLowerCase())
//   );

//   // Apply level and type filters to enrolled courses
//   const filteredAndSortedEnrolledCourses = filteredEnrolledCourses
//     .filter(course => levelFilter ? course.level === levelFilter : true)
//     .filter(course => typeFilter ? course.category === typeFilter : true);

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 mb-2">My Courses</h1>
//             <p className="text-gray-600">Continue your learning journey</p>
//           </div>
//           <div className="mt-4 md:mt-0 w-full md:w-auto">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//               />
//               <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* YouTube Search Section */}
//       {activeTab === 'youtube' && (
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <h2 className="text-xl font-bold text-gray-800 mb-2">Find YouTube Tutorials</h2>
//               <p className="text-gray-600">Search for music tutorials on YouTube</p>
//             </div>
//             <div className="mt-4 md:mt-0 w-full md:w-auto flex">
//               <div className="relative flex-grow">
//                 <input
//                   type="text"
//                   placeholder="Search YouTube tutorials..."
//                   value={youtubeSearchTerm}
//                   onChange={(e) => setYoutubeSearchTerm(e.target.value)}
//                   className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 />
//                 <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//               <button
//                 onClick={() => fetchYoutubeVideos(youtubeSearchTerm)}
//                 className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-lg transition-colors"
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Tabs */}
//       <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//         <div className="flex space-x-4 border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab('enrolled')}
//             className={`py-2 px-4 font-medium ${activeTab === 'enrolled'
//               ? 'text-amber-600 border-b-2 border-amber-600'
//               : 'text-gray-500 hover:text-gray-700'
//               }`}
//           >
//             My Enrolled Courses ({enrolledCourses.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('available')}
//             className={`py-2 px-4 font-medium ${activeTab === 'available'
//               ? 'text-amber-600 border-b-2 border-amber-600'
//               : 'text-gray-500 hover:text-gray-700'
//               }`}
//           >
//             Available Courses
//           </button>
//           <button
//             onClick={() => setActiveTab('youtube')}
//             className={`py-2 px-4 font-medium ${activeTab === 'youtube'
//               ? 'text-amber-600 border-b-2 border-amber-600'
//               : 'text-gray-500 hover:text-gray-700'
//               }`}
//           >
//             YouTube Courses
//           </button>
//         </div>
//       </div>

//       {/* Enrolled Courses */}
//       {activeTab === 'enrolled' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredAndSortedEnrolledCourses.map((course) => (
//             <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//               <img
//                 src={course.image}
//                 alt={course.title}
//                 className="w-full h-40 object-cover"
//               />

//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-2">
//                   <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
//                 </div>

//                 <div className="flex gap-2 mb-2">
//                   <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{course.level}</span>
//                   <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{course.category}</span>
//                 </div>

//                 <p className="text-gray-600 text-sm mb-3">Instructor: {course.instructor}</p>

//                 <div className="mb-3">
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">Progress</span>
//                     <span className="font-medium text-gray-800">{course.progress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600"
//                       style={{ width: `${course.progress}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div className="mb-4 p-3 bg-amber-50 rounded-lg">
//                   <p className="text-sm text-amber-800 font-medium">Next Lesson: {course.nextLesson}</p>
//                   <p className="text-xs text-amber-600">{course.nextLessonDate}</p>
//                 </div>

//                 <div className="space-y-2">
//                   <button 
//                     onClick={() => handleViewCourse(course)}
//                     className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all"
//                   >
//                     Voir le cours
//                   </button>
                  
//                   {course.courseContent && course.courseContent.lessons && (
//                     <div className="text-center">
//                       <p className="text-xs text-gray-500">
//                         {course.courseContent.lessons.length} leçon{course.courseContent.lessons.length > 1 ? 's' : ''} disponible{course.courseContent.lessons.length > 1 ? 's' : ''}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Available Courses */}
//       {activeTab === 'available' && (
//         <div>
//           {/* Regular Courses */}
//           {filteredAvailableCourses.length > 0 && (
//             <div className="mb-8">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Available Courses</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredAvailableCourses.map((course) => (
//                   <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                     <img
//                       src={`${databaseUri}${course.image}`}
//                       alt={course.title}
//                       className="w-full h-40 object-cover"
//                     />

//                     <div className="p-6">
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
//                       </div>

//                       <div className="flex gap-2 mb-2">
//                         <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{course.level}</span>
//                         <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{course.category}</span>
//                       </div>

//                       <p className="text-gray-600 text-sm mb-2">{course.description}</p>

//                       <div className="flex justify-between items-center">
//                         <span className="text-xl font-bold text-gray-800">${course.amount}</span>
//                         <button 
//                           onClick={() => handleEnrollCourse(course)}
//                           className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
//                         >
//                           S'inscrire
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* youtube Courses */}
//       {activeTab === 'youtube' && (
//         <div>
//           {/* YouTube Videos */}
//           <h3 className="text-xl font-bold text-gray-800 mb-4">YouTube Tutorials</h3>
//           {filteredYoutubeVideos.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredYoutubeVideos.map((video) => (
//                 <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                   <div className="relative">
//                     <img
//                       src={video.image}
//                       alt={video.title}
//                       className="w-full h-40 object-cover"
//                     />
//                     <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                       <a
//                         href={`https://www.youtube.com/watch?v=${video.videoId}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-white bg-red-600 rounded-full p-3 hover:bg-red-700 transition-colors"
//                       >
//                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
//                         </svg>
//                       </a>
//                     </div>
//                     <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
//                       YouTube
//                     </div>
//                   </div>

//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{video.title}</h3>
//                     </div>

//                     <div className="flex gap-2 mb-2">
//                       <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{video.level}</span>
//                       <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{video.category}</span>
//                     </div>

//                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">Instructor: {video.instructor}</p>

//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center">
//                         <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.965 9.21c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                         <span className="text-gray-700 text-sm">{video.rating}</span>
//                       </div>
//                       <span className="text-gray-600 text-sm">Free</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">No YouTube videos found</h3>
//               <p className="mt-1 text-gray-500">Try searching for music tutorials on YouTube</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Already Viewed Courses */}
//       {activeTab === 'already' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {enrolledCourses.filter(c => c.viewed).map(course => (
//             <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//               <img
//                 src={course.image}
//                 alt={course.title}
//                 className="w-full h-40 object-cover"
//               />

//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-2">
//                   <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
//                 </div>

//                 <div className="flex gap-2 mb-2">
//                   <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{course.level}</span>
//                   <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{course.category}</span>
//                 </div>

//                 <p className="text-gray-600 text-sm mb-3">Instructor: {course.instructor}</p>

//                 <div className="mb-3">
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">Progress</span>
//                     <span className="font-medium text-gray-800">{course.progress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600"
//                       style={{ width: `${course.progress}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div className="mb-4 p-3 bg-amber-50 rounded-lg">
//                   <p className="text-sm text-amber-800 font-medium">Next Lesson: {course.nextLesson}</p>
//                   <p className="text-xs text-amber-600">{course.nextLessonDate}</p>
//                 </div>

//                 <button className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all">Resume Course</button>

//                 <div className="mt-4">
//                   <button className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all">Mark as Complete</button>
//                 </div>

//               </div>

//             </div>

//           ))}

//         </div>
//       )}

//       {/* Course Viewer Modal */}
//       {showCourseViewer && selectedCourse && (
//         <CourseViewer 
//           course={selectedCourse} 
//           onClose={() => {
//             setShowCourseViewer(false);
//             setSelectedCourse(null);
//           }} 
//         />
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Scourse = () => {
  const [activeTab, setActiveTab] = useState('enrolled');
  const [searchTerm, setSearchTerm] = useState('');
  const [youtubeSearchTerm, setYoutubeSearchTerm] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseViewer, setShowCourseViewer] = useState(false);

  // État pour les cours inscrits - utiliser useState pour permettre les modifications
  const [enrolledCourses, setEnrolledCourses] = useState([
    {
      id: 1,
      title: 'Piano Basics for Beginners',
      instructor: 'John Smith',
      progress: 85,
      category: 'Piano',
      level: 'Beginner',
      image: '/piano.jpg',
      nextLesson: 'Chord Progressions',
      nextLessonDate: 'Tomorrow, 10:00 AM',
      viewed: true,
      courseContent: {
        lessons: [
          {
            id: 1,
            title: 'Introduction to Piano',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: '15:30',
            thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
          },
          {
            id: 2,
            title: 'Piano Theory Guide',
            type: 'pdf',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            pages: 25
          },
          {
            id: 3,
            title: 'Practice Exercises Audio',
            type: 'audio',
            url: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
            duration: '12:45'
          }
        ]
      }
    },
    {
      id: 2,
      title: 'Music Theory Fundamentals',
      instructor: 'Emma Wilson',
      progress: 72,
      category: 'Theory',
      level: 'Beginner',
      image: '/flute.jpg',
      nextLesson: 'Intervals and Scales',
      nextLessonDate: 'Today, 2:00 PM',
      viewed: false,
      courseContent: {
        lessons: [
          {
            id: 1,
            title: 'Music Theory Basics',
            type: 'pdf',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            pages: 30
          },
          {
            id: 2,
            title: 'Scales Explanation',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: '20:15',
            thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg'
          }
        ]
      }
    },
    {
      id: 3,
      title: 'Guitar Chord Progressions',
      instructor: 'Michael Brown',
      progress: 60,
      category: 'Guitar',
      level: 'Intermediate',
      image: '/guitar.jpg',
      nextLesson: 'Barre Chords',
      nextLessonDate: 'Friday, 4:00 PM',
      viewed: true,
      courseContent: {
        lessons: [
          {
            id: 1,
            title: 'Guitar Chord Theory',
            type: 'pdf',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            pages: 20
          },
          {
            id: 2,
            title: 'Chord Practice Session',
            type: 'audio',
            url: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
            duration: '18:30'
          }
        ]
      }
    }
  ]);

  const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

  // Fonction pour s'inscrire à un cours
  const handleEnrollCourse = (course) => {
    // Vérifier si le cours n'est pas déjà inscrit
    const isAlreadyEnrolled = enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id);
    
    if (!isAlreadyEnrolled) {
      const newEnrolledCourse = {
        ...course,
        progress: 0,
        nextLesson: 'Introduction',
        nextLessonDate: 'Available now',
        viewed: false,
        courseContent: {
          lessons: [
            {
              id: 1,
              title: `${course.title} - Introduction`,
              type: 'pdf',
              url: `/docs/${course.title.toLowerCase().replace(/\s+/g, '-')}-intro.pdf`,
              pages: 15
            },
            {
              id: 2,
              title: `${course.title} - Video Guide`,
              type: 'video',
              url: `/videos/${course.title.toLowerCase().replace(/\s+/g, '-')}-guide.mp4`,
              duration: '25:00'
            }
          ]
        }
      };
      
      setEnrolledCourses(prev => [...prev, newEnrolledCourse]);
      alert(`Vous êtes maintenant inscrit au cours : ${course.title}`);
    } else {
      alert('Vous êtes déjà inscrit à ce cours !');
    }
  };

  // Fonction pour ouvrir le visualiseur de cours
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseViewer(true);
  };

  // Fonction pour télécharger un fichier
  const handleDownloadFile = (lesson) => {
    // Créer un lien de téléchargement simulé
    const link = document.createElement('a');
    link.href = lesson.url;
    link.download = lesson.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Composant pour le visualiseur de cours
  const CourseViewer = ({ course, onClose }) => {
    const [activeLesson, setActiveLesson] = useState(course.courseContent.lessons[0]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{course.title}</h2>
              <p className="text-gray-600">Instructeur : {course.instructor}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Sidebar avec les leçons */}
            <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Contenu du cours</h3>
                {course.courseContent.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                      activeLesson.id === lesson.id
                        ? 'bg-amber-100 border-l-4 border-amber-500'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveLesson(lesson)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{lesson.title}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          {lesson.type === 'video' && (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              {lesson.duration}
                            </>
                          )}
                          {lesson.type === 'pdf' && (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                              {lesson.pages} pages
                            </>
                          )}
                          {lesson.type === 'audio' && (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.9 14.2A1 1 0 014 13.4V6.6a1 1 0 01.9-.8l3.483-2.616zm7.724 1.35A7.977 7.977 0 0118 10c0 2.407-1.06 4.566-2.741 6.018l-1.228-1.228A6.013 6.013 0 0016 10a6.013 6.013 0 00-1.97-4.465l1.229-1.228z" clipRule="evenodd" />
                              </svg>
                              {lesson.duration}
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile(lesson);
                        }}
                        className="p-1 text-gray-500 hover:text-amber-600 transition-colors"
                        title="Télécharger"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone de contenu principal */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{activeLesson.title}</h3>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    activeLesson.type === 'video' ? 'bg-red-100 text-red-800' :
                    activeLesson.type === 'pdf' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {activeLesson.type.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleDownloadFile(activeLesson)}
                    className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Télécharger
                  </button>
                </div>
              </div>

              {/* Zone de visualisation du contenu */}
              <div className="bg-gray-100 rounded-lg overflow-hidden min-h-96">
                {activeLesson.type === 'video' && (
                  <div className="w-full h-full">
                    <video
                      key={activeLesson.url} // Force re-render when lesson changes
                      controls
                      className="w-full h-96 object-contain bg-black"
                      poster={activeLesson.thumbnail || ''}
                      preload="metadata"
                    >
                      <source src={activeLesson.url} type="video/mp4" />
                      <source src={activeLesson.url} type="video/webm" />
                      <source src={activeLesson.url} type="video/ogg" />
                      Votre navigateur ne supporte pas la lecture vidéo HTML5.
                    </video>
                    <div className="p-4 bg-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Durée: {activeLesson.duration}</p>
                          <p className="text-xs text-gray-500 mt-1">Utilisez les contrôles pour naviguer dans la vidéo</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const video = document.querySelector('video');
                              if (video.requestFullscreen) {
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
                              video.currentTime = 0;
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
                {activeLesson.type === 'pdf' && (
                  <div className="w-full h-96 flex flex-col">
                    <iframe
                      src={activeLesson.url}
                      className="w-full flex-1 border-0"
                      title={activeLesson.title}
                    />
                    <div className="p-4 bg-white border-t">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">{activeLesson.pages} pages</p>
                        <a
                          href={activeLesson.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Ouvrir dans un nouvel onglet
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {activeLesson.type === 'audio' && (
                  <div className="flex flex-col items-center justify-center h-96 p-8">
                    <div className="w-full max-w-md">
                      <div className="mb-6 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.9 14.2A1 1 0 014 13.4V6.6a1 1 0 01.9-.8l3.483-2.616z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">{activeLesson.title}</h3>
                        <p className="text-sm text-gray-600">Durée: {activeLesson.duration}</p>
                      </div>
                      
                      <audio
                        key={activeLesson.url}
                        controls
                        className="w-full"
                        preload="metadata"
                      >
                        <source src={activeLesson.url} type="audio/mpeg" />
                        <source src={activeLesson.url} type="audio/wav" />
                        <source src={activeLesson.url} type="audio/ogg" />
                        Votre navigateur ne supporte pas la lecture audio HTML5.
                      </audio>
                      
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">Utilisez les contrôles audio pour écouter le contenu</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Message d'erreur si le type n'est pas reconnu */}
                {!['video', 'pdf', 'audio'].includes(activeLesson.type) && (
                  <div className="flex items-center justify-center h-96 text-gray-500">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-lg font-medium">Type de contenu non supporté</p>
                      <p className="text-sm">Ce type de fichier ne peut pas être affiché</p>
                    </div>
                  </div>
                )}
              </div>
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
                src={course.image}
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
                src={course.image}
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
        />
      )}
    </div>
  );
};