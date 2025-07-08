// import React, { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import axios from 'axios';

// export const Calendars = ({ role }) => {
//   const [events, setEvents] = useState([]);


//   // 🔁 Charger les événements existants
//   useEffect(() => {
//     fetch(`http://localhost:3000/calender/all`)
//       .then(res => res.json())
//       .then(data => setEvents(data))
//       .catch(err => console.error("Erreur lors du chargement :", err));
//   }, []);

//   // 📌 Ajouter un événement lors du clic sur une date
//   // const handleDateClick = async (arg) => {
//   //    // Récupérer le rôle depuis le localStorage
//   //    const adminData = localStorage.getItem('admin');
//   //    const role = adminData ? JSON.parse(adminData).role : null;
//   //   //  const role = localStorage.getItem.parse('role'); // Assure-toi que le rôle est bien stocké sous cette clé
     
//   //   console.log("Rôle :", role);
//   //   console.log("Date cliquée :", arg); // ← ajoute ce log
//   //   if (role !== 'admin') return;

//   //   const title = prompt("Titre de l'événement :");
//   //   const description = prompt("Description de l'événement :");

//   //   if (title && description) {
//   //     const startDate = new Date(arg.dateStr);
//   //     const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // par défaut, +2h

//   //     const newEvent = {
//   //       title,
//   //       description,
//   //       start_date: startDate.toISOString(),
//   //       end_date: endDate.toISOString(),
//   //       audience: 'teacher', // ou selon un choix personnalisé
//   //     };

//   //     try {
//   //       const response = await fetch('http://localhost:3000/calender/create', {
//   //         method: 'POST',
//   //         headers: { 'Content-Type': 'application/json' },
//   //         body: JSON.stringify(newEvent),
//   //       });

//   //       const savedEvent = await response.json();
//   //       setEvents([...events, {
//   //         title: savedEvent.title,
//   //         start: savedEvent.start_date,
//   //         end: savedEvent.end_date,
//   //         audience: savedEvent.audience
//   //       }]);
//   //     } catch (err) {
//   //       console.error("Erreur lors de l'ajout :", err);
//   //     }

      
//   //   }
    
//   // };

//   const handleDateSelect = async (arg) => {
//     // Récupérer le rôle depuis le localStorage
//      const adminData = localStorage.getItem('admin');
//      const role = adminData ? JSON.parse(adminData).role : null;
//     if (role !== 'admin') return;
  
//     const title = prompt("Titre de l'événement :");
//     if (!title) return;
  
//     const start = prompt("Date de début (YYYY-MM-DDTHH:mm):", arg.startStr);
//     const end = prompt("Date de fin (YYYY-MM-DDTHH:mm):", arg.endStr);
  
//     const audienceInput = prompt("Audience (admin, teacher, student, tous):", "tous");
//     let audience = [];
  
//     if (audienceInput === "tous") {
//       audience = ["admin", "teacher", "student"];
//     } else {
//       audience = audienceInput.split(',').map(a => a.trim());
//     }
  
//     const newEvent = {
//       title,
//       start_date: new Date(start).toISOString(),
//       end_date: new Date(end).toISOString(),
//       audience,
//     };
  
//     try {
//       const { data: savedEvent } = await axios.post('http://localhost:3000/calender/create', newEvent);
  
//       setEvents([...events, {
//         title: savedEvent.title,
//         start: savedEvent.start_date,
//         end: savedEvent.end_date,
//         audience: savedEvent.audience,
//       }]);
//     } catch (err) {
//       console.error("Erreur lors de l'ajout :", err);
//     }
//   };
//   const formattedEvents = events.map(e => ({
//     title: e.title,
//     start: e.start_date,
//     end: e.end_date,
//     audience: e.audience
//   }));

//   return (
//     <div className="calendar-container">
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         selectable={true}
//         events={formattedEvents}
//         select={handleDateSelect}
//         height="auto"
//         timeZone="local" // ou 'UTC', ou 'Europe/Paris'
//       />
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

export const Calendars = () => {

      const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description:'',
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
    return localDate.toISOString().slice(0, 16); // format 'YYYY-MM-DDTHH:mm'
  };

  const handleDateSelect = (arg) => {

     
    // if (role !== 'admin') return;

    const formattedDate = formatDateForInput(arg.startStr);


    // const formatForInput = (dateStr) => {
    //   const date = new Date(dateStr);
    //   const offset = date.getTimezoneOffset();
    //   const local = new Date(date.getTime() - offset * 60 * 1000);
    //   return local.toISOString().slice(0, 16);
    // };
    setSelectedDate(arg.startStr);
    setFormData({
      title: '',
      // start_date: formatForInput(arg.startStr),
      // end_date: formatForInput(arg.endStr || arg.startStr),
      start_date:formattedDate,
      end_date:formattedDate,

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

  return (
    <div className="calendar-container">
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
            '#888', // default
        }))}
        selectable={true}
        select={handleDateSelect}
        height="auto"
      />

{showForm && (
  <div className="bg-white p-6 border border-gray-300 mt-6 rounded-lg shadow-md max-w-lg mx-auto">
    <h3 className="text-xl font-semibold mb-4 text-gray-700">Créer un événement</h3>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block font-medium text-gray-600">Titre</label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium text-gray-600">Description</label>
        <input
          id="description"
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
        />
      </div>

      <div>
        <label htmlFor="start_date" className="block font-medium text-gray-600">Début</label>
        <input
          id="start_date"
          type="datetime-local"
          name="start_date"
          value={formData.start_date}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
        />
      </div>

      <div>
        <label htmlFor="end_date" className="block font-medium text-gray-600">Fin</label>
        <input
          id="end_date"
          type="datetime-local"
          name="end_date"
          value={formData.end_date}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
        />
      </div>

      <div>
        <label htmlFor="audience" className="block font-medium text-gray-600">Audience</label>
        <select
          id="audience"
          name="audience"
          value={formData.audience}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-green-300"
        >
          <option value="">-- Choisir une audience --</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="teacher_and_student">Teacher and Student</option>
        </select>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Enregistrer
        </button>
      </div>
    </form>
  </div>
)}

    </div>
  );
};
