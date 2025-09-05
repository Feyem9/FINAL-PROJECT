import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Scalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI || 'http://localhost:3000';
    // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
    const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;


    const studentData = JSON.parse(localStorage.getItem('student'));
    const studentId = studentData?._id;

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${databaseUri}/calender/all`);
                setEvents(response.data);
            } catch (err) {
                setError('Failed to fetch events');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchEvents();
        }
    }, [studentId]);

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
        return events.some(event => {
            const eventDate = new Date(event.start_date || event.start);
            return formatDate(eventDate) === formattedDate;
        });
    };

    // Get events for a specific date
    const getEventsForDate = (date) => {
        if (!date) return [];
        const formattedDate = formatDate(date);
        return events.filter(event => {
            const eventDate = new Date(event.start_date || event.start);
            return formatDate(eventDate) === formattedDate;
        });
    };

    // Navigate to previous month
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Get upcoming events
    const getUpcomingEvents = () => {
        const now = new Date();
        return events
            .filter(event => new Date(event.start_date || event.start) >= now)
            .sort((a, b) => new Date(a.start_date || a.start) - new Date(b.start_date || b.start))
            .slice(0, 5);
    };

    const todayEvents = getEventsForDate(selectedDate);
    const upcomingEvents = getUpcomingEvents();

    if (loading) {
        return <div className="text-center p-8">Loading calendar...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Schedule</h1>
                        <p className="text-gray-600">View your upcoming classes and events</p>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Events</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{events.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">This Month</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">
                                    {events.filter(e => {
                                        const eventDate = new Date(e.start_date || e.start);
                                        return eventDate.getMonth() === currentDate.getMonth() &&
                                            eventDate.getFullYear() === currentDate.getFullYear();
                                    }).length}
                                </p>
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
                                <p className="text-gray-500 text-sm font-medium">Upcoming</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{upcomingEvents.length}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Today</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{todayEvents.length}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
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
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white font-bold'
                                                : formatDate(day) === formatDate(selectedDate)
                                                    ? 'bg-amber-100 text-amber-800 font-bold'
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
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Events for {selectedDate.toLocaleDateString()}
                            </h2>

                            {todayEvents.length === 0 ? (
                                <p className="text-gray-600">No events scheduled for this day</p>
                            ) : (
                                <div className="space-y-4">
                                    {todayEvents.map((event) => (
                                        <div key={event._id} className="border-l-4 border-blue-500 p-4 rounded-r-lg bg-blue-50">
                                            <h3 className="font-bold text-gray-800">{event.title}</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {new Date(event.start_date || event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-gray-700 mt-2">{event.description}</p>
                                            <p className="text-gray-600 text-sm mt-2">Instructor: {event.instructor || 'Not specified'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Classes</h2>

                            <div className="space-y-4">
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map((event, index) => {
                                        const eventDate = new Date(event.start_date || event.start);
                                        const today = new Date();
                                        const tomorrow = new Date(today);
                                        tomorrow.setDate(today.getDate() + 1);

                                        let dateLabel = '';
                                        if (eventDate.toDateString() === today.toDateString()) {
                                            dateLabel = 'Today';
                                        } else if (eventDate.toDateString() === tomorrow.toDateString()) {
                                            dateLabel = 'Tomorrow';
                                        } else {
                                            dateLabel = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                        }

                                        return (
                                            <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {event.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {dateLabel}, {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mt-2">
                                                        {event.audience || 'All'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">No upcoming events</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};