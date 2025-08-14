import React, { useState } from 'react';
import axios from 'axios';

export const Sprofile = () => {
  // Get student data from localStorage
  const studentData = JSON.parse(localStorage.getItem('student')) || {};

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(studentData.image || null);
  const [formData, setFormData] = useState({
    name: studentData.name || '',
    email: studentData.email || '',
    contact: studentData.contact || '',
    level: studentData.level || '',
    instrument: studentData.instrument || '',
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI || 'http://localhost:3000';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // First, upload the image file to the server
      const formDataImage = new FormData();
      formDataImage.append('file', selectedImage);

      // Upload image to server
      const uploadResponse = await axios.post(`${databaseUri}/upload`, formDataImage, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imagePath = uploadResponse.data.path;

      // Then, update the student profile with the image path
      const studentId = studentData._id;
      const updateResponse = await axios.patch(`${databaseUri}/upload`, {
        image: imagePath
      });

      // Update localStorage with the new student data
      const updatedStudent = { ...studentData, image: imagePath };
      localStorage.setItem('student', JSON.stringify(updatedStudent));

      setSuccess('Profile photo updated successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to update profile photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const studentId = studentData._id;
      const updateResponse = await axios.patch(`${databaseUri}/uplload`, formData);

      // Update localStorage with the new student data
      const updatedStudent = { ...studentData, ...formData };
      localStorage.setItem('student', JSON.stringify(updatedStudent));

      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Progress data for the student
  const progressData = [
    { course: 'Piano Basics', progress: 85, color: 'bg-blue-500' },
    { course: 'Music Theory', progress: 72, color: 'bg-green-500' },
    { course: 'Chord Progressions', progress: 60, color: 'bg-amber-500' },
    { course: 'Jazz Piano', progress: 45, color: 'bg-red-500' },
  ];

  // Upcoming tasks
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
                  <img
                    src={imagePreview.startsWith('/uploads/') ? `http://localhost:3000${imagePreview}` : imagePreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-500"
                  />
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
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <h2 className="text-lg font-bold text-gray-800 mt-4">{studentData.name || 'Student'}</h2>
              <p className="text-gray-600 text-sm">{studentData.email || 'student@example.com'}</p>

              {selectedImage && (
                <button
                  onClick={handleImageUpload}
                  disabled={loading}
                  className={`mt-3 px-3 py-1 text-white text-sm rounded-lg transition-all shadow ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                    }`}
                >
                  {loading ? 'Saving...' : 'Save Photo'}
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
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'progress' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Progress Overview
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Account Settings
              </button>
            </div>
          </div>

          {/* Stats Card */}
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

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg transition-colors ${loading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
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
      );
    </div>
  );
};
