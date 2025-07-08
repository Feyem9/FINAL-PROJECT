import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

export const Tcalender = () => {

  const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    audience: 'teacher',
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const teacher = JSON.parse(localStorage.getItem('teacher'));
  const role = teacher?.role;

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${databaseUri}/calender/all`);
      const teacherEvents = res.data.filter(e =>
        e.audience === 'teacher' || e.audience === 'teacher_and_student'
      );
      setEvents(teacherEvents);
    } catch (err) {
      console.error("Erreur de chargement des événements :", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDateForInput = (dateStr) => {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleDateSelect = (arg) => {
    setSelectedDate(arg.startStr);
    setFormData({
      title: '',
      description: '',
      start_date: formatDateForInput(arg.startStr),
      end_date: formatDateForInput(arg.startStr),
      audience: 'teacher',
    });
    setEditingId(null);
    setShowForm(true);
    setShowPreview(false);
  };

  const handleEventClick = (arg) => {
    const clickedEvent = arg.event;

    const found = events.find(e => {
      const clickedStart = new Date(clickedEvent.start).toISOString();
      const itemStart = new Date(e.start_date).toISOString();
      return e.title === clickedEvent.title && itemStart === clickedStart;
    });

    setSelectedEvent(found || null);
    setShowPreview(true);
    setShowForm(false); // 👈 cacher le formulaire ici
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    };

    try {
      if (editingId) {
        await axios.put(`${databaseUri}/calender/${editingId}`, payload);
      } else {
        await axios.post(`${databaseUri}/calender/create`, payload);
      }
      // setShowForm(false);
      // setEditingId(null);
      fetchEvents();
      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
        setSuccessMessage('formulaire modifié avec succès !');
      }, 1500); // ⏱️ ferme automatiquement après 1.5 sec

    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  const handleDelete = async () => {
    if (editingId) {
      try {
        await axios.delete(`${databaseUri}/calender/${editingId}`);
        setShowForm(false);
        setEditingId(null);
        fetchEvents();
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendrier Enseignant</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map(e => ({
          title: e.title,
          start: e.start_date,
          end: e.end_date,
          backgroundColor:
            e.audience === 'teacher' ? '#007bff' :
              e.audience === 'teacher_and_student' ? '#6f42c1' : '#ccc',
        }))}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        height="auto"
      />

      {/* Aperçu d'un événement */}
      {showPreview && selectedEvent && (
        <div className="bg-white p-6 mt-6 border rounded shadow-md max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Détails de l'événement</h3>
          <p><strong>Titre :</strong> {selectedEvent.title}</p>
          <p><strong>Description :</strong> {selectedEvent.description}</p>
          <p><strong>Début :</strong> {new Date(selectedEvent.start_date).toLocaleString()}</p>
          <p><strong>Fin :</strong> {new Date(selectedEvent.end_date).toLocaleString()}</p>
          <p><strong>Audience :</strong> {selectedEvent.audience}</p>

          <div className="flex justify-between mt-4">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setFormData({
                  title: selectedEvent.title,
                  description: selectedEvent.description,
                  start_date: formatDateForInput(selectedEvent.start_date),
                  end_date: formatDateForInput(selectedEvent.end_date),
                  audience: selectedEvent.audience,
                });
                setEditingId(selectedEvent._id);
                setShowForm(true);  // 👈 le formulaire s’affiche ici
                setShowPreview(false);
              }}
            >
              Modifier
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setShowPreview(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Formulaire de création/modification */}
      {showForm && (
        <div className="bg-white p-6 mt-6 border rounded shadow-md max-w-md mx-auto transition-all duration-500 ease-in-out"
        >
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Modifier' : 'Créer'} un événement</h3>
          {successMessage && (
            <div className="bg-green-100 text-green-800 p-2 rounded mb-2 text-center">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Titre"
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="end_date"
              type="datetime-local"
              value={formData.end_date}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <select
              name="audience"
              value={formData.audience}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="teacher">Teacher</option>
              <option value="teacher_and_student">Teacher and Student</option>
            </select>
            <div className="flex justify-between">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingId ? 'Modifier' : 'Créer'}
              </button>
              {editingId && (
                <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                  Supprimer
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
