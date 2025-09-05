import React, { useState } from 'react';

export const Tcalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        time: '',
        description: '',
    });

    // Mock events data
    const events = [
        {
            id: 1,
            date: '2025-08-12',
            time: '10:00 AM',
            title: 'Piano Basics Class',
            description: 'Introduction to basic piano chords for beginners',
            students: 12,
            color: 'bg-blue-100 border-blue-500'
        },
        {
            id: 2,
            date: '2025-08-12',
            time: '2:00 PM',
            title: 'Music Theory Session',
            description: 'Understanding scales and intervals',
            students: 8,
            color: 'bg-green-100 border-green-500'
        },
        {
            id: 3,
            date: '2025-08-13',
            time: '11:00 AM',
            title: 'Guitar Workshop',
            description: 'Chord progressions and strumming patterns',
            students: 15,
            color: 'bg-amber-100 border-amber-500'
        },
        {
            id: 4,
            date: '2025-08-15',
            time: '4:00 PM',
            title: 'Advanced Jazz Piano',
            description: 'Improvisation techniques',
            students: 6,
            color: 'bg-red-100 border-red-500'
        },
    ];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    // Format date as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Check if a date has events
    const hasEvents = (date) => {
        if (!date) return false;
        const formattedDate = formatDate(date);
        return events.some(event => event.date === formattedDate);
    };

    // Get events for a specific date
    const getEventsForDate = (date) => {
        if (!date) return [];
        const formattedDate = formatDate(date);
        return events.filter(event => event.date === formattedDate);
    };

    // Navigate to previous month
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateEvent = (e) => {
        e.preventDefault();
        // In a real app, you would send this to your backend
        console.log('Creating event:', newEvent);
        alert('Event created successfully!');
        setShowEventModal(false);
        setNewEvent({
            title: '',
            time: '',
            description: '',
        });
    };

    const todayEvents = getEventsForDate(selectedDate);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Schedule</h1>
                        <p className="text-gray-600">Manage your teaching calendar and events</p>
                    </div>
                    <button
                        onClick={() => setShowEventModal(true)}
                        className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-md"
                    >
                        Add New Event
                    </button>
                </div>
            </div>

            {/* Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Create New Event</h2>
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreateEvent}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Event Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newEvent.title}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Time</label>
                                        <input
                                            type="text"
                                            name="time"
                                            value={newEvent.time}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 10:00 AM"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={newEvent.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowEventModal(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
                                    >
                                        Create Event
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
                                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <h2 className="text-lg font-bold text-gray-800">
                                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>

                            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
                                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map((day, index) => (
                                <div key={index} className="text-center text-gray-600 font-medium py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {getDaysInMonth(currentDate).map((day, index) => (
                                <div
                                    key={index}
                                    onClick={() => day && setSelectedDate(day)}
                                    className={`min-h-16 p-2 text-center cursor-pointer rounded-lg transition-colors ${!day
                                        ? ''
                                        : formatDate(day) === formatDate(new Date())
                                            ? 'bg-orange-500 text-white font-bold'
                                            : formatDate(day) === formatDate(selectedDate)
                                                ? 'bg-orange-100 text-orange-800 font-bold'
                                                : hasEvents(day)
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {day ? day.getDate() : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Events for selected date */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            Events for {selectedDate.toLocaleDateString()}
                        </h2>

                        {todayEvents.length === 0 ? (
                            <p className="text-gray-600">No events scheduled for this day</p>
                        ) : (
                            <div className="space-y-4">
                                {todayEvents.map((event) => (
                                    <div key={event.id} className={`border-l-4 p-4 rounded-r-lg ${event.color}`}>
                                        <h3 className="font-bold text-gray-800">{event.title}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{event.time}</p>
                                        <p className="text-gray-700 mt-2">{event.description}</p>
                                        <p className="text-gray-600 text-sm mt-2">{event.students} students</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Events</h2>

                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-800">Piano Basics Class</span>
                                    <span className="text-gray-600 text-sm">Tomorrow</span>
                                </div>
                                <p className="text-gray-600 text-sm">10:00 AM • 12 students</p>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-800">Music Theory Session</span>
                                    <span className="text-gray-600 text-sm">Aug 14</span>
                                </div>
                                <p className="text-gray-600 text-sm">2:00 PM • 8 students</p>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-800">Guitar Workshop</span>
                                    <span className="text-gray-600 text-sm">Aug 15</span>
                                </div>
                                <p className="text-gray-600 text-sm">11:00 AM • 15 students</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
