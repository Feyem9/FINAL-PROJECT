import React, { useState } from 'react';
import axios from 'axios';

export const Tcourses = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    level: '',
    category: '',
    price: '',
  });

  // Mock course data
  const courses = [
    {
      id: 1,
      title: 'Piano Basics for Beginners',
      description: 'Learn the fundamentals of piano playing including basic chords and melodies.',
      level: 'Beginner',
      category: 'Piano',
      students: 42,
      price: 29.99,
      status: 'Published',
      image: '/piano.jpg'
    },
    {
      id: 2,
      title: 'Advanced Jazz Piano Techniques',
      description: 'Master complex jazz chords, improvisation, and advanced techniques.',
      level: 'Advanced',
      category: 'Piano',
      students: 28,
      price: 49.99,
      status: 'Published',
      image: '/prof-piano.jpg'
    },
    {
      id: 3,
      title: 'Guitar Chord Progressions',
      description: 'Learn essential guitar chords and how to create beautiful progressions.',
      level: 'Intermediate',
      category: 'Guitar',
      students: 35,
      price: 39.99,
      status: 'Draft',
      image: '/guitar.jpg'
    },
    {
      id: 4,
      title: 'Music Theory Fundamentals',
      description: 'Understand the building blocks of music including scales, intervals, and chords.',
      level: 'Beginner',
      category: 'Theory',
      students: 56,
      price: 34.99,
      status: 'Published',
      image: '/flute.jpg'
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
    
    // Get teacher ID from localStorage
    const teacherData = JSON.parse(localStorage.getItem('teacher') || '{}');
    const teacherId = teacherData?._id || '';
    
    if (!teacherId) {
      alert('Teacher ID not found. Please log in again.');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('title', newCourse.title);
    formData.append('description', newCourse.description);
    formData.append('amount', (newCourse.price)); // Convert price to amount
    formData.append('level', newCourse.level.toLowerCase()); // Ensure lowercase
    formData.append('category', newCourse.category.toLowerCase()); // Ensure lowercase
    formData.append('media', 'video'); // Default media type
    formData.append('teacher_id', teacherId);
    formData.append('image', ''); // Optional fields
    formData.append('fileUrl', '');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${databaseUri}/course/create`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Course created:', response.data);
      alert('Course created successfully!');
      setShowCreateForm(false);
      setNewCourse({
        title: '',
        description: '',
        level: '',
        category: '',
        price: '',
      });
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredCourses = activeTab === 'all'
    ? courses
    : courses.filter(course => course.status.toLowerCase() === activeTab);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Courses</h1>
            <p className="text-gray-600">Manage and create your music courses</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-md"
          >
            Create New Course
          </button>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Create New Course</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateCourse}>
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
                    <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      value={newCourse.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Piano">Piano</option>
                      <option value="Guitar">Guitar</option>
                      <option value="Violin">Violin</option>
                      <option value="Flute">Flute</option>
                      <option value="Theory">Music Theory</option>
                      <option value="Vocal">Vocal Training</option>
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
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={newCourse.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

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
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
                  >
                    Create Course
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
          <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'Published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {course.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {course.level}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {course.category}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">Students</p>
                  <p className="font-bold text-gray-800">{course.students}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Price</p>
                  <p className="font-bold text-gray-800">${course.price}</p>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 py-2 px-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium">
                  Edit
                </button>
                <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
