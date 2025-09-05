import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import interactionPlugin from '@fullcalendar/interaction';

export const Scalender = () => {

  // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
  // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;




  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
  });
  const [editingEventId, setEditingEventId] = useState(null);

  const student = JSON.parse(localStorage.getItem('student'));

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  const fetchEvents = () => {
    axios.get(`${databaseUri}/calender/all`)
      .then((res) => {
        const filteredEvents = res.data.filter(event =>
          event.audience === 'student' ||
          event.audience === 'teacher_and_student' ||
          (event.creator === student?._id)
        );
        setEvents(filteredEvents);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des événements :", err);
      });
  };

  const handleEventClick = ({ event }) => {
    const found = events.find(e => {
      const eventStart = new Date(event.start).toISOString();
      const itemStart = new Date(e.start_date).toISOString();
      return e.title === event.title && itemStart === eventStart;
    });
    setSelectedEvent(found || null);
    setEditingEventId(null);
    setShowForm(false);
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleString('fr-FR', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      audience: 'student',
      creator: student._id,
    };

    if (editingEventId) {
      axios.put(`${databaseUri}/calender/update/${editingEventId}`, dataToSend)
        .then(() => {
          fetchEvents();
          resetForm();
        })
        .catch(err => {
          console.error('Erreur lors de la mise à jour :', err);
        });
    } else {
      axios.post(`${databaseUri}/calender/create`, dataToSend)
        .then(() => {
          fetchEvents();
          resetForm();
        })
        .catch(err => {
          console.error('Erreur lors de la création :', err);
        });
    }
  };

  const handleDelete = () => {
    if (selectedEvent && selectedEvent.creator === student._id) {
      axios.delete(`${databaseUri}/calender/delete/${selectedEvent._id}`)
        .then(() => {
          fetchEvents();
          setSelectedEvent(null);
        })
        .catch(err => {
          console.error('Erreur lors de la suppression :', err);
        });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({ title: '', description: '', start_date: '', end_date: '' });
    setEditingEventId(null);
    setSelectedEvent(null);
  };

  const handleEdit = () => {
    if (selectedEvent && selectedEvent.creator === student._id) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description,
        start_date: selectedEvent.start_date,
        end_date: selectedEvent.end_date,
      });
      setEditingEventId(selectedEvent._id);
      setShowForm(true);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
        Bienvenue {student?.name}, voici votre calendrier
      </h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingEventId(null);
            setFormData({ title: '', description: '', start_date: '', end_date: '' });
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          + Ajouter une tâche
        </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map(e => ({
          title: e.title,
          start: e.start_date,
          end: e.end_date,
          backgroundColor:
            e.audience === 'student' ? '#28a745' :
              e.audience === 'teacher_and_student' ? '#6f42c1' :
                '#888',
        }))}
        eventClick={handleEventClick}
        dateClick={(arg) => {
          setFormData({
            title: '',
            description: '',
            start_date: arg.dateStr + "T00:00",
            end_date: arg.dateStr + "T23:59",
          });
          setEditingEventId(null);
          setShowForm(true);
        }}
        height="auto"
      />

      {/* Modal d'affichage d'un événement */}
      {selectedEvent && !showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-green-700 mb-4">{selectedEvent.title}</h3>
            <p className="text-gray-700 mb-2">
              <strong>Description :</strong> {selectedEvent.description || 'Aucune'}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Début :</strong> {formatDate(selectedEvent.start_date)}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Fin :</strong> {formatDate(selectedEvent.end_date)}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Audience :</strong> {selectedEvent.audience}
            </p>
            <div className="text-right space-x-2">
              {(() => {
                console.log('DEBUG creator:', selectedEvent.creator, 'student._id:', student._id);
                return null;
              })()}
              {String(selectedEvent.creator) === String(student._id) && (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Supprimer
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal formulaire ajout/édition */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-green-700 mb-4">
              {editingEventId ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h3>
            <input
              type="text"
              name="title"
              placeholder="Titre"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full mb-3 p-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
            ></textarea>
            <label className="block mb-1 text-sm font-medium">Début :</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full mb-3 p-2 border rounded"
            />
            <label className="block mb-1 text-sm font-medium">Fin :</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="w-full mb-3 p-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
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
