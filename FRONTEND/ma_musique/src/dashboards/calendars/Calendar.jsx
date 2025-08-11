// import React, { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import axios from 'axios';

// export const Calendars = () => {

//       // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
//           const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;



//   const [events, setEvents] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description:'',
//     start_date: '',
//     end_date: '',
//     audience: [],
//   });
//   const [showForm, setShowForm] = useState(false);
//   const role = JSON.parse(localStorage.getItem('admin'))?.role;


//   useEffect(() => {
//     axios.get(`${databaseUri}/calender/all`)
//       .then(res => setEvents(res.data))
//       .catch(err => console.error("Erreur lors du chargement :", err));
//   }, []);

//   const formatDateForInput = (dateStr) => {
//     const date = new Date(dateStr);
//     const offset = date.getTimezoneOffset();
//     const localDate = new Date(date.getTime() - offset * 60 * 1000);
//     return localDate.toISOString().slice(0, 16); // format 'YYYY-MM-DDTHH:mm'
//   };

//   const handleDateSelect = (arg) => {


//     // if (role !== 'admin') return;

//     const formattedDate = formatDateForInput(arg.startStr);


//     // const formatForInput = (dateStr) => {
//     //   const date = new Date(dateStr);
//     //   const offset = date.getTimezoneOffset();
//     //   const local = new Date(date.getTime() - offset * 60 * 1000);
//     //   return local.toISOString().slice(0, 16);
//     // };
//     setSelectedDate(arg.startStr);
//     setFormData({
//       title: '',
//       // start_date: formatForInput(arg.startStr),
//       // end_date: formatForInput(arg.endStr || arg.startStr),
//       start_date:formattedDate,
//       end_date:formattedDate,

//       audience: '',
//     });
//     setShowForm(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data: savedEvent } = await axios.post(`${databaseUri}/calender/create`, {
//         ...formData,
//         start_date: new Date(formData.start_date).toISOString(),
//         end_date: new Date(formData.end_date).toISOString(),
//       });
//       setEvents([...events, {
//         title: savedEvent.title,
//         start: savedEvent.start_date,
//         end: savedEvent.end_date,
//         audience: savedEvent.audience,
//       }]);
//       setShowForm(false);
//     } catch (err) {
//       console.error("Erreur lors de l'ajout :", err);
//     }
//   };

//   return (
//     <div className="calendar-container">
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         events={events.map(e => ({
//           title: e.title,
//           start: e.start_date,
//           end: e.end_date,
//           backgroundColor:
//             e.audience === 'teacher' ? '#007bff' :
//             e.audience === 'student' ? '#28a745' :
//             e.audience === 'teacher_and_student' ? '#6f42c1' :
//             '#888', // default
//         }))}
//         selectable={true}
//         select={handleDateSelect}
//         height="auto"
//       />

// {showForm && (
//   <div className="bg-white p-6 border border-gray-300 mt-6 rounded-lg shadow-md max-w-lg mx-auto">
//     <h3 className="text-xl font-semibold mb-4 text-gray-700">Créer un événement</h3>
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label htmlFor="title" className="block font-medium text-gray-600">Titre</label>
//         <input
//           id="title"
//           type="text"
//           name="title"
//           placeholder="Titre"
//           value={formData.title}
//           onChange={handleInputChange}
//           required
//           className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
//         />
//       </div>

//       <div>
//         <label htmlFor="description" className="block font-medium text-gray-600">Description</label>
//         <input
//           id="description"
//           type="text"
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleInputChange}
//           required
//           className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
//         />
//       </div>

//       <div>
//         <label htmlFor="start_date" className="block font-medium text-gray-600">Début</label>
//         <input
//           id="start_date"
//           type="datetime-local"
//           name="start_date"
//           value={formData.start_date}
//           onChange={handleInputChange}
//           required
//           className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
//         />
//       </div>

//       <div>
//         <label htmlFor="end_date" className="block font-medium text-gray-600">Fin</label>
//         <input
//           id="end_date"
//           type="datetime-local"
//           name="end_date"
//           value={formData.end_date}
//           onChange={handleInputChange}
//           required
//           className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
//         />
//       </div>

//       <div>
//         <label htmlFor="audience" className="block font-medium text-gray-600">Audience</label>
//         <select
//           id="audience"
//           name="audience"
//           value={formData.audience}
//           onChange={handleInputChange}
//           required
//           className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
//         >
//           <option value="">-- Choisir une audience --</option>
//           <option value="teacher">Teacher</option>
//           <option value="student">Student</option>
//           <option value="teacher_and_student">Teacher and Student</option>
//         </select>
//       </div>

//       <div className="text-right">
//         <button
//           type="submit"
//           className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
//         >
//           Enregistrer
//         </button>
//       </div>
//     </form>
//   </div>
// )}

//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

export const Calendars = () => {
  // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
  const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    audience: [],
  });
  const [showForm, setShowForm] = useState(false);
  const role = JSON.parse(localStorage.getItem('admin'))?.role;

  useEffect(() => {
    axios.get(`${databaseUri}/calender/all`)
      .then(res => setEvents(res.data))
      .catch(err => console.error("Erreur lors du chargement :", err));
  }, []);

  const formatDateForInput = (dateStr) => {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleDateSelect = (arg) => {
    const formattedDate = formatDateForInput(arg.startStr);
    setSelectedDate(arg.startStr);
    setFormData({
      title: '',
      description: '',
      start_date: formattedDate,
      end_date: formattedDate,
      audience: '',
    });
    setShowForm(true);
  };

  const handleNewEventClick = () => {
    const now = new Date();
    const formattedNow = formatDateForInput(now.toISOString());
    setFormData({
      title: '',
      description: '',
      start_date: formattedNow,
      end_date: formattedNow,
      audience: '',
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: savedEvent } = await axios.post(`${databaseUri}/calender/create`, {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      });
      setEvents([...events, {
        title: savedEvent.title,
        start: savedEvent.start_date,
        end: savedEvent.end_date,
        audience: savedEvent.audience,
      }]);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter(event => new Date(event.start_date || event.start) >= now)
      .sort((a, b) => new Date(a.start_date || a.start) - new Date(b.start_date || b.start))
      .slice(0, 4);
  };

  const formatEventTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Calendar</h1>
            <p className="text-gray-600">Manage your schedule and upcoming events</p>
          </div>
          <button
            onClick={handleNewEventClick}
            className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Event
          </button>
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
                <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
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
                <p className="text-2xl font-bold text-gray-800 mt-1">{getUpcomingEvents().length}</p>
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
                <p className="text-gray-500 text-sm font-medium">Audience</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">3</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a1 1 0 11-2 0 1 1 0 012 0zM7 10a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events.map(e => ({
                  title: e.title,
                  start: e.start_date,
                  end: e.end_date,
                  backgroundColor:
                    e.audience === 'teacher' ? '#007bff' :
                      e.audience === 'student' ? '#28a745' :
                        e.audience === 'teacher_and_student' ? '#6f42c1' :
                          '#888',
                }))}
                selectable={true}
                select={handleDateSelect}
                height="600px"
                headerToolbar={{
                  left: 'title',
                  center: '',
                  right: 'prev,next'
                }}
              />
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {getUpcomingEvents().length > 0 ? (
                  getUpcomingEvents().map((event, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Today, {formatEventTime(event.start_date || event.start)}
                        </p>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mt-2">
                          {event.audience || 'All'}
                        </span>
                      </div>
                    </div>
                  ))
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

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Create Event</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      placeholder="Enter event title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Enter event description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        id="start_date"
                        type="datetime-local"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        id="end_date"
                        type="datetime-local"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-2">
                      Audience
                    </label>
                    <select
                      id="audience"
                      name="audience"
                      value={formData.audience}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    >
                      <option value="">-- Select Audience --</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                      <option value="teacher_and_student">Teacher and Student</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg"
                    >
                      Save Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};