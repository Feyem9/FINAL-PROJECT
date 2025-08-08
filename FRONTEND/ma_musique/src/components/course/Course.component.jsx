// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Container from "@mui/material/Container"
// import TextField from "@mui/material/TextField"
// import Button from "@mui/material/Button"
// import Typography from "@mui/material/Typography"
// import Select from "@mui/material/Select"
// import MenuItem from "@mui/material/MenuItem"
// import Card from "@mui/material/Card"
// import CardContent from "@mui/material/CardContent"
// import CardActions from "@mui/material/CardActions"
// import Grid from "@mui/material/Grid"
// import InputLabel from "@mui/material/InputLabel"
// import FormControl from "@mui/material/FormControl"
// import Dialog from "@mui/material/Dialog"
// import DialogTitle from "@mui/material/DialogTitle"
// import DialogContent from "@mui/material/DialogContent"
// import DialogActions from "@mui/material/DialogActions"

// const useCourses = () => {

//     // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
//         const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;


//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get(`${databaseUri}/course/all`);
//         setCourses(response.data);
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//       }
//     };

//     fetchCourses();
//   }, []);

//   return { courses, setCourses, loading, setLoading };
// };

// const useNewCourse = () => {
//   const [newCourse, setNewCourse] = useState({
//     title: '',
//     description: '',
//     amount: '',
//     level: '',
//     media: 'video',
//     category: '',
//   });
//   const [file, setFile] = useState(null);
  

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewCourse((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   return { newCourse, setNewCourse, file, setFile, handleInputChange, handleFileChange };
// };

// export default function Course() {
//   const { courses, setCourses, loading, setLoading } = useCourses();
//   const { newCourse, setNewCourse, file, setFile, handleInputChange, handleFileChange } = useNewCourse();
//   const [open, setOpen] = useState(false);

//   // Récupère l'id du teacher depuis le localStorage (à adapter selon ton auth)
//   const teacherData = JSON.parse(localStorage.getItem('teacher') || '{}');
//   const teacherId = teacherData?._id || '';

//   const handleCreateCourse = async () => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('title', newCourse.title);
//     formData.append('description', newCourse.description);
//     formData.append('amount', newCourse.amount);
//     formData.append('level', newCourse.level);
//     formData.append('media', newCourse.media);
//     formData.append('category', newCourse.category);
//     formData.append('teacher_id', teacherId);
//     if (file) formData.append('file', file);
//     console.log('file', file);
//     console.log('formdata',formData);
    

//     try {
//       const response = await axios.post(`${databaseUri}/course/create`, formData);
//       setCourses((prev) => [...prev, response.data]);
//       setNewCourse({
//         title: '',
//         description: '',
//         amount: '',
//         level: '',
//         media: 'video',
//         category: '',
//       });
//       setFile(null);
//       setOpen(false); // Ferme le modal après création
//     } catch (error) {
//       console.error('Error creating course:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteCourse = async (courseId) => {
//     try {
//       await axios.delete(`${databaseUri}/course/delete/${courseId}`);
//       setCourses((prev) => prev.filter(course => course._id !== courseId));
//     } catch (error) {
//       console.error('Error deleting course:', error);
//     }
//   };

//   // Couleurs selon le type de média
//   const mediaColors = {
//     video: '#e3f2fd',
//     pdf: '#fce4ec',
//     audio: '#e8f5e9',
//   };

//   return (
//     <Container maxWidth="md">
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         Course Management
//       </Typography>

//       {/* Bouton pour ouvrir le modal */}
//       <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={() => setOpen(true)}>
//         Nouveau cours
//       </Button>

//       {/* Modal de création de cours */}
//       <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Create New Course</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Course Title"
//             name="title"
//             variant="outlined"
//             margin="normal"
//             value={newCourse.title}
//             onChange={handleInputChange}
//           />
//           <TextField
//             fullWidth
//             label="Course Description"
//             name="description"
//             variant="outlined"
//             margin="normal"
//             multiline
//             rows={3}
//             value={newCourse.description}
//             onChange={handleInputChange}
//           />
//           <TextField
//             fullWidth
//             label="Course Amount ($)"
//             name="amount"
//             type="number"
//             variant="outlined"
//             margin="normal"
//             value={newCourse.amount}
//             onChange={handleInputChange}
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Category</InputLabel>
//             <Select name="category" value={newCourse.category} onChange={handleInputChange}>
//               <MenuItem value="piano">Piano</MenuItem>
//               <MenuItem value="flute">Flute</MenuItem>
//               <MenuItem value="violon">Violon</MenuItem>
//               <MenuItem value="baterie">Baterie</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Level</InputLabel>
//             <Select name="level" value={newCourse.level} onChange={handleInputChange}>
//               <MenuItem value="beginner">Beginner</MenuItem>
//               <MenuItem value="intermediate">Intermediate</MenuItem>
//               <MenuItem value="advanced">Advanced</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Media Type</InputLabel>
//             <Select name="media" value={newCourse.media} onChange={handleInputChange}>
//               <MenuItem value="video">Video</MenuItem>
//               <MenuItem value="pdf">PDF</MenuItem>
//               <MenuItem value="audio">Audio</MenuItem>
//             </Select>
//           </FormControl>
//           <Button variant="contained" component="label" fullWidth sx={{ my: 2 }}>
//             Upload Media
//             <input type="file" name='file' hidden onChange={handleFileChange} />
//           </Button>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)} color="secondary">
//             Annuler
//           </Button>
//           <Button onClick={handleCreateCourse} color="primary" variant="contained" disabled={loading}>
//             {loading ? "Creating Course..." : "Create Course"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Liste des cours */}
//       <Typography variant="h5" fontWeight="bold" mb={2}>
//         All Courses
//       </Typography>

//       <Grid container spacing={3}>
//         {courses.map((course) => (
//           <Grid item xs={12} sm={6} md={4} key={course._id}>
//             <Card sx={{ p: 2, boxShadow: 2, backgroundColor: mediaColors[course.media] || '#fff' }}>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold">
//                   {course.title}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {course.description}
//                 </Typography>
//                 {/* Affichage de la vidéo si fileUrl existe */}
//                 {course.fileUrl && course.media === "video" && (
//                   <video controls width="100%" style={{ marginTop: 8 }}>
//                     <source src={`http://localhost:3000${course.fileUrl}`} type="video/mp4" />
//                     Votre navigateur ne supporte pas la lecture vidéo.
//                   </video>
//                 )}
//                 {/* Affichage du PDF si media=pdf */}
//                 {course.fileUrl && course.media === "pdf" && (
//                   <a
//                     href={`http://localhost:3000${course.fileUrl}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{ display: "block", marginTop: 8 }}
//                   >
//                     Voir le PDF
//                   </a>
//                 )}
//                 {/* Affichage de l'audio si media=audio */}
//                 {course.fileUrl && course.media === "audio" && (
//                   <audio controls style={{ marginTop: 8, width: "100%" }}>
//                     <source src={`http://localhost:3000${course.fileUrl}`} type="audio/mpeg" />
//                     Votre navigateur ne supporte pas la lecture audio.
//                   </audio>
//                 )}
//                 <Typography variant="subtitle1" mt={1}>
//                   Amount: <b>${course.amount}</b>
//                 </Typography>
//                 <Typography variant="subtitle1">Category: {course.category}</Typography>
//                 <Typography variant="subtitle1">Level: {course.level}</Typography>
//                 <Typography variant="subtitle1">Media: {course.media}</Typography>
//               </CardContent>
//               <CardActions>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   fullWidth
//                   onClick={() => handleDeleteCourse(course._id)}
//                 >
//                   Delete
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Les imports MUI ne sont plus nécessaires pour le rendu final
// import Container from "@mui/material/Container"
// import TextField from "@mui/material/TextField"
// import Button from "@mui/material/Button"
// import Typography from "@mui/material/Typography"
// import Select from "@mui/material/Select"
// import MenuItem from "@mui/material/MenuItem"
// import Card from "@mui/material/Card"
// import CardContent from "@mui/material/CardContent"
// import CardActions from "@mui/material/CardActions"
// import Grid from "@mui/material/Grid"
// import InputLabel from "@mui/material/InputLabel"
// import FormControl from "@mui/material/FormControl"
// import Dialog from "@mui/material/Dialog"
// import DialogTitle from "@mui/material/DialogTitle"
// import DialogContent from "@mui/material/DialogContent"
// import DialogActions from "@mui/material/DialogActions"

// Tes hooks restent inchangés
const useCourses = () => {
    const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

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
    }, []);

    return { courses, setCourses, loading, setLoading };
};

const useNewCourse = () => {
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        amount: '',
        level: '',
        media: 'video',
        category: '',
    });
    const [file, setFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return { newCourse, setNewCourse, file, setFile, handleInputChange, handleFileChange };
};

export default function Course() {
    const { courses, setCourses, loading, setLoading } = useCourses();
    const { newCourse, setNewCourse, file, setFile, handleInputChange, handleFileChange } = useNewCourse();
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    // Récupère l'id du teacher depuis le localStorage (à adapter selon ton auth)
    const teacherData = JSON.parse(localStorage.getItem('teacher') || '{}');
    const teacherId = teacherData?._id || '';

    const handleCreateCourse = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', newCourse.title);
        formData.append('description', newCourse.description);
        formData.append('amount', newCourse.amount);
        formData.append('level', newCourse.level);
        formData.append('media', newCourse.media);
        formData.append('category', newCourse.category);
        formData.append('teacher_id', teacherId);
        if (file) formData.append('file', file);
        console.log('file', file);
        console.log('formdata', formData);

        try {
            const response = await axios.post(`${databaseUri}/course/create`, formData);
            setCourses((prev) => [...prev, response.data]);
            setNewCourse({
                title: '',
                description: '',
                amount: '',
                level: '',
                media: 'video',
                category: '',
            });
            setFile(null);
            setOpen(false);
        } catch (error) {
            console.error('Error creating course:', error);
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
    
    // Ajout de la logique de filtrage et de recherche
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || course.level === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Courses Management</h1>
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-[#3b9e4a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#348c41] transition-colors"
                    >
                        <i className="fas fa-plus mr-2"></i>New Course
                    </button>
                </header>

                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <div className="w-full md:w-auto">
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="All">Filter by Level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between relative overflow-hidden">
                            {/* "Active" Tag */}
                            <span className="absolute top-0 right-0 bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-bl-lg">
                                Active
                            </span>
                            
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                    <i className="fas fa-react text-2xl text-green-600"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                                    <p className="text-sm text-gray-500">Learn the basics of React development</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-user-graduate"></i>
                                    <span>24 Students</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-book-open"></i>
                                    <span>8 Lessons</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                                <button
                                    className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                                    onClick={() => console.log('View course')}
                                >
                                    <i className="fas fa-eye mr-2"></i>View
                                </button>
                                <button
                                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                    onClick={() => console.log('Edit course')}
                                >
                                    <i className="fas fa-edit mr-2"></i>Edit
                                </button>
                                <button
                                    className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                                    onClick={() => handleDeleteCourse(course._id)}
                                >
                                    <i className="fas fa-trash-alt mr-2"></i>Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal de création de cours (stylisé avec Tailwind) */}
                {open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Create New Course</h2>
                                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800">
                                    &times;
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Course Title"
                                    value={newCourse.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <textarea
                                    name="description"
                                    placeholder="Course Description"
                                    value={newCourse.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Course Amount ($)"
                                    value={newCourse.amount}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <select
                                    name="category"
                                    value={newCourse.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Category</option>
                                    <option value="piano">Piano</option>
                                    <option value="flute">Flute</option>
                                    <option value="violon">Violon</option>
                                    <option value="baterie">Baterie</option>
                                </select>
                                <select
                                    name="level"
                                    value={newCourse.level}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                <select
                                    name="media"
                                    value={newCourse.media}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="video">Video</option>
                                    <option value="pdf">PDF</option>
                                    <option value="audio">Audio</option>
                                </select>
                                <label className="flex items-center justify-center w-full px-4 py-2 border border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-50">
                                    <i className="fas fa-upload mr-2"></i>
                                    <span>{file ? file.name : 'Upload Media'}</span>
                                    <input type="file" name="file" hidden onChange={handleFileChange} />
                                </label>
                            </div>
                            
                            <div className="flex justify-end mt-6 space-x-2">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateCourse}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-lg text-white bg-[#3b9e4a] hover:bg-[#348c41] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating...' : 'Create Course'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}