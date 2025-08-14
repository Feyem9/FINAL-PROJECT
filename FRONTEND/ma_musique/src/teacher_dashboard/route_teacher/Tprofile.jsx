import React, { useState } from 'react';

export const Tprofile = () => {
  // Get teacher data from localStorage
  const teacherData = JSON.parse(localStorage.getItem('teacher')) || {};

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(teacherData.image || null);
  const [formData, setFormData] = useState({
    name: teacherData.name || '',
    email: teacherData.email || '',
    contact: teacherData.contact || '',
    speciality: teacherData.speciality || '',
  });
  const [isEditing, setIsEditing] = useState(false);

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

    // In a real implementation, you would send this to your backend
    // For now, we'll just update localStorage
    const updatedTeacher = { ...teacherData, image: imagePreview };
    localStorage.setItem('teacher', JSON.stringify(updatedTeacher));

    alert('Profile photo updated successfully!');
  };

  const handleSaveChanges = () => {
    // In a real implementation, you would send this to your backend
    // For now, we'll just update localStorage
    const updatedTeacher = { ...teacherData, ...formData };
    localStorage.setItem('teacher', JSON.stringify(updatedTeacher));

    setIsEditing(false);
    alert('Profile updated successfully!');
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

  return (
    <div className="max-w-6xl mx-auto">
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
                  <img
                    src={imagePreview.startsWith('/uploads/') ? `http://localhost:3000${imagePreview}` : imagePreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {teacherData.name?.charAt(0) || 'T'}
                  </div>
                )}
                <label htmlFor="imageUpload" className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-2 cursor-pointer shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

              {selectedImage && (
                <button
                  onClick={handleImageUpload}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-md"
                >
                  Save Photo
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
                <span className="font-semibold">2023</span>
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
