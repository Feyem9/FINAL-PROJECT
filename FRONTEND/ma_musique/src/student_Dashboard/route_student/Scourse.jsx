import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Scourse = () => {
  const [activeTab, setActiveTab] = useState('enrolled');
  const [searchTerm, setSearchTerm] = useState('');
  const [youtubeSearchTerm, setYoutubeSearchTerm] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);

  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: 'Piano Basics for Beginners',
      instructor: 'John Smith',
      progress: 85,
      category: 'Piano',
      level: 'Beginner',
      image: '/piano.jpg',
      nextLesson: 'Chord Progressions',
      nextLessonDate: 'Tomorrow, 10:00 AM'
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
      nextLessonDate: 'Today, 2:00 PM'
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
      nextLessonDate: 'Friday, 4:00 PM'
    },
  ];

  // Mock available courses data
  const mockAvailableCourses = [
    {
      id: 4,
      title: 'Advanced Jazz Piano Techniques',
      instructor: 'Sarah Davis',
      rating: 4.8,
      students: 124,
      price: 49.99,
      category: 'Piano',
      level: 'Advanced',
      image: '/prof-piano.jpg',
      description: 'Master complex jazz chords, improvisation, and advanced techniques.'
    },
    {
      id: 5,
      title: 'Vocal Training Masterclass',
      instructor: 'Robert Johnson',
      rating: 4.9,
      students: 89,
      price: 39.99,
      category: 'Vocal',
      level: 'Intermediate',
      image: '/mon_prof.jpg',
      description: 'Develop your singing voice with professional techniques.'
    },
    {
      id: 6,
      title: 'Violin for Beginners',
      instructor: 'Jennifer Lee',
      rating: 4.7,
      students: 67,
      price: 34.99,
      category: 'Violin',
      level: 'Beginner',
      image: '/prof-violon.jpg',
      description: 'Start your violin journey with proper technique and posture.'
    },
  ];

  const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

  // Fetch available courses from database
  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        // For now, we'll use mock data
        setAvailableCourses(mockAvailableCourses);
      } catch (error) {
        console.error('Error fetching available courses:', error);
        // Fallback to mock data
        setAvailableCourses(mockAvailableCourses);
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
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
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
      {activeTab === 'available' && (
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
            My Enrolled Courses
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
        </div>
      </div>

      {/* Enrolled Courses */}
      {activeTab === 'enrolled' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {course.level}
                  </span>
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

                <button className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all">
                  Continue Learning
                </button>
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
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {course.category}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                      <p className="text-gray-600 text-sm mb-3">Instructor: {course.instructor}</p>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.965 9.21c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-700 text-sm">{course.rating}</span>
                        </div>
                        <span className="text-gray-600 text-sm">{course.students} students</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">${course.price}</span>
                        <button className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YouTube Videos */}
          <div>
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
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {video.level}
                        </span>
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
        </div>
      )}
    </div>
  );
};
