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
      const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    const adminId = admin._id;
    // console.log(adminId);
    
  const authorId = localStorage.getItem('userId') || adminId;
  

  const fetchNotes = async () => {
    
    try {
      // console.log(authorId);
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
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    const adminId = admin._id;
    const authorId = localStorage.getItem('userId') || adminId;
    console.log('Submitting note:', { ...newNote, authorId });

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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Notes</h1>
            <p className="text-gray-600">Manage your personal notes and reminders</p>
          </div>
          <button
            onClick={handleCreateNote}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Note
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Notes</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{notes.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">5</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <select className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="ideas">Ideas</option>
            </select>
            <select className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Sort By</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {notes.length === 0 && !loading ? (
          <div className="text-center p-12 bg-white rounded-2xl shadow-sm">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No notes found</h3>
            <p className="text-gray-600 mb-6">Create your first note to get started!</p>
            <button
              onClick={handleCreateNote}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
            >
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNote(note._id)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        title="Edit note"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        title="Delete note"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{note.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{formatDate(note.createdAt)}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full">Personal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de création/édition de note */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingNote ? 'Edit Note' : 'Create New Note'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitNote}>
                <div className="mb-5">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition"
                    placeholder="Enter note content..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
