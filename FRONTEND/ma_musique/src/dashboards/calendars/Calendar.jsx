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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
          <button
            onClick={handleNewEventClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
          >
            <span className="text-lg">+</span>
            New Event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {getUpcomingEvents().length > 0 ? (
                  getUpcomingEvents().map((event, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Today, {formatEventTime(event.start_date || event.start)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">Aucun événement à venir</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Créer un événement</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Titre
                    </label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      placeholder="Titre de l'événement"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Description de l'événement"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Début
                    </label>
                    <input
                      id="start_date"
                      type="datetime-local"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Fin
                    </label>
                    <input
                      id="end_date"
                      type="datetime-local"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
                      Audience
                    </label>
                    <select
                      id="audience"
                      name="audience"
                      value={formData.audience}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">-- Choisir une audience --</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                      <option value="teacher_and_student">Teacher and Student</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Enregistrer
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