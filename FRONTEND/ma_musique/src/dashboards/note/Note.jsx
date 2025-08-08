import React, { useState, useEffect } from 'react';

// Supposons que tu aies configuré une variable d'environnement pour l'API
const databaseUri = 'http://localhost:3000';

export const Note = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Simulation de l'utilisateur connecté pour l'exemple
  const authorId = localStorage.getItem('userId') || 'defaultUserId';

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${databaseUri}/notes/all`, {
        headers: {
          // Supposons que l'ID de l'utilisateur est dans les headers pour l'API
          'x-author-id': authorId,
        },
      });
      console.log('Fetched notes:', response);


      if (!response.ok) {
        let errorMessage = 'Failed to fetch notes';
        if (response.status === 401) {
          errorMessage = 'Unauthorized - Please log in again';
        } else if (response.status === 404) {
          // No notes found is not an error, it's a valid response
          setNotes([]);
          return;
        }
        throw new Error(`${errorMessage}: ${response.status}`);
      }

      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError('Failed to fetch notes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [authorId]);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
    setNewNote({ title: '', content: '' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewNote({ title: '', content: '' });
    setEditingNote(null);
    setError(null);
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    const authorId = localStorage.getItem('userId') || 'defaultUserId';

    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSubmitting(true);
    try {
      // If we're editing an existing note
      if (editingNote) {
        const response = await fetch(`${databaseUri}/notes/update/${editingNote._id}`, {
          method: 'PATCH',
          headers: {
            'x-author-id': authorId,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...newNote, authorId })
        });

        if (!response.ok) {
          let errorMessage = 'Failed to update note';
          if (response.status === 401) {
            errorMessage = 'Unauthorized - Please log in again';
          } else if (response.status === 404) {
            errorMessage = 'Note not found';
          } else if (response.status === 400) {
            errorMessage = 'Invalid note data';
          }
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `${errorMessage}: ${response.status}`);
        }

        const updatedNote = await response.json();
        setNotes(notes.map(note => note._id === editingNote._id ? updatedNote : note));
      } else {
        // Creating a new note
        const response = await fetch(`${databaseUri}/notes/create`, {
          method: 'POST',
          headers: {
            'x-author-id': authorId,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...newNote, authorId })
        });

        // Gérer les erreurs HTTP (par ex., 404, 500)
        if (!response.ok) {
          let errorMessage = 'Failed to create note';
          if (response.status === 401) {
            errorMessage = 'Unauthorized - Please log in again';
          } else if (response.status === 400) {
            errorMessage = 'Invalid note data';
          }
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `${errorMessage}: ${response.status}`);
        }

        const createdNote = await response.json();
        setNotes([createdNote, ...notes]);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message || `Failed to ${editingNote ? 'update' : 'create'} note.`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find(note => note._id === noteId);
    if (noteToEdit) {
      setEditingNote(noteToEdit);
      setNewNote({ title: noteToEdit.title, content: noteToEdit.content });
      setIsModalOpen(true);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`${databaseUri}/notes/remove/${noteId}`, {
        method: 'DELETE',
        headers: { 'x-author-id': authorId },
      });

      if (!response.ok) {
        let errorMessage = 'Failed to delete note';
        if (response.status === 401) {
          errorMessage = 'Unauthorized - Please log in again';
        } else if (response.status === 404) {
          errorMessage = 'Note not found';
        }
        throw new Error(`${errorMessage}: ${response.status}`);
      }

      setNotes(notes.filter(note => note._id !== noteId));
    } catch (err) {
      setError('Failed to delete note.');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const diffInDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return <div className="text-center p-8">Loading notes...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Notes</h1>
          <button
            onClick={handleCreateNote}
            className="bg-[#3b9e4a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#348c41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <span className="mr-2">+</span>New Note
          </button>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {notes.length === 0 && !loading ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">No notes found. Create your first note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center text-gray-400 text-sm mb-4">
                  <span className="text-xl">📄</span>
                  <span>{formatDate(note.createdAt)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{note.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{note.content}</p>
                </div>
                <div className="flex justify-end mt-4 text-gray-500 space-x-3">
                  <button
                    onClick={() => handleEditNote(note._id)}
                    className="hover:text-green-600 transition-colors"
                    title="Edit note"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="hover:text-red-500 transition-colors"
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de création/édition de note */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingNote ? 'Edit Note' : 'Create New Note'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitNote}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter note title..."
                    autoFocus
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Enter note content..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#3b9e4a] text-white rounded-md hover:bg-[#348c41] focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? (editingNote ? 'Updating...' : 'Creating...')
                      : (editingNote ? 'Update Note' : 'Create Note')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
