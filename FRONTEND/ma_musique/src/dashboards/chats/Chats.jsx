// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { Worker, Viewer } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';

// const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

// export const Chats = ({ role, senderId, receiverId }) => {
//   const [showOptions, setShowOptions] = useState(false);

//   // --- Tes hooks d'état et d'effets restent inchangés ---
//   const [admin, setAdmin] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);
//   const chatEndRef = useRef(null);
//   const [onlineStatus, setOnlineStatus] = useState('Offline'); // État pour le statut en ligne
//   const [chatUser, setChatUser] = useState(null); // État pour l'utilisateur du chat

//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState(null);
//   const [typing, setTyping] = useState(false);
//   const [typingUser, setTypingUser] = useState(null);

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`${databaseUri}/chat/${m.id}`, {
//         data: { userId: senderId }
//       });
//       setMessages(prev => prev.filter(msg => msg.id !== m.id));
//     } catch (error) {
//       setError('Erreur lors de la suppression');
//     }
//   };

//   useEffect(() => {
//     const storedAdmin = JSON.parse(localStorage.getItem('admin'));

//     if (!storedAdmin) {
//       console.warn('⛔ Admin non connecté — redirection vers /home');
//       window.location.href = '/home';
//       return;
//     }
//     setAdmin(storedAdmin);

//     // Initialisation du socket
//     const socketInstance = io('http://localhost:3000', {
//       query: { userId: storedAdmin._id },
//     });
//     setSocket(socketInstance);

//     // Déconnexion
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//    const handleError = useCallback((error) => {
//       console.error('Erreur socket:', error);
//       setError('Problème de connexion. Reconnexion en cours...');
//       setTimeout(() => setError(null), 3000);
//     }, []);


//   useEffect(() => {
//     if (!socket || !senderId || !receiverId) return;

//     // Logique pour la gestion de la room et l'historique des messages
//     const sortedIds = [senderId, receiverId].sort();
//     const room = `${sortedIds[0]}-${sortedIds[1]}`;
//     socket.emit('joinRoom', { room, senderId, receiverId });
//     socket.on('chatHistory', (history) => {
//       setMessages(history.map((m) => ({ ...m, id: m._id || uuidv4() })));
//     });

//     socket.on('receiveMessage', (msg) => {
//       setMessages((prev) => [...prev, { ...msg, id: uuidv4() }]);
//     });

//     // Écoute des événements de statut en ligne
//     socket.on('userStatus', (status) => {
//       if (status.userId === receiverId) {
//         setOnlineStatus(status.isOnline ? 'Online' : 'Offline');
//       }
//     });

//     // NOUVEAUX ÉVÉNEMENTS À AJOUTER :
//     socket.on('connect', () => {
//       setIsConnected(true);
//       setError(null);
//     });

//     socket.on('disconnect', () => {
//       setIsConnected(false);
//       setError('Connexion perdue');
//     });

//     socket.on('error', handleError);

//     socket.on('userTyping', (data) => {
//       if (data.senderId === receiverId) {
//         setTypingUser(data.senderId);
//         setTimeout(() => setTypingUser(null), 3000);
//       }
//     });

//     socket.on('userStoppedTyping', (data) => {
//       if (data.senderId === receiverId) {
//         setTypingUser(null);
//       }
//     });

//     // Récupérer les infos de l'utilisateur du chat (receiverId)
//     // C'est une hypothèse, tu devras adapter l'URL à ton API
//     axios.get(`${databaseUri}/users/${receiverId}`)
//       .then(res => setChatUser(res.data))
//       .catch(err => console.error(err));

//     return () => {
//       socket.off('chatHistory');
//       socket.off('receiveMessage');
//       socket.off('userStatus');
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('error');
//       socket.off('userTyping');
//       socket.off('userStoppedTyping');
//     };
//   }, [socket, senderId, receiverId, databaseUri, handleError]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const validateMessage = (msg) => {
//     if (!msg || msg.trim().length === 0) return false;
//     if (msg.length > 1000) return false; // Limite de caractères
//     return true;
//   };

//   const sanitizeMessage = (msg) => {
//     return msg.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
//   };

//   const sendMessage = () => {
//     const sanitizedMessage = sanitizeMessage(message);
//     if (!validateMessage(sanitizedMessage) || !socket || !isConnected) {
//       setError('Message invalide ou connexion perdue');
//       return;
//     };

//     const messageData = {
//       senderId,
//       receiverId,
//       message: sanitizedMessage,
//       role,
//       timestamp: new Date().toISOString(),
//     };

//     // Logique d'envoi de message
//     socket.emit('sendMessage', { ...messageData });
//     setMessages((prev) => [...prev, { id: uuidv4(), ...messageData, createdAt: new Date() }]);
//     setMessage('');

//     // Arrêter l'indicateur de frappe
//     if (typing) {
//       setTyping(false);
//       socket.emit('stopTyping', { senderId, receiverId });
//     }
//   };

//   // --- Les fonctions d'upload de fichiers restent inchangées ---
//   const uploadFile = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     setUploading(true);

//     try {
//       const res = await axios.post(
//         `${databaseUri}/chat/upload`,
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       setUploading(false);
//       return res.data.url;
//     } catch (err) {
//       setUploading(false);
//       console.error('Erreur upload:', err);
//       alert('Erreur upload');
//       return null;
//     }
//   };

//   // const handleFileChange = async (e) => {
//   //   if (!e.target.files?.length || !socket) return;
//   //   const file = e.target.files[0];
//   //   const fileUrl = await uploadFile(file);

//   //   if (fileUrl) {
//   //     socket.emit('sendMessage', {
//   //       senderId,
//   //       receiverId,
//   //       message: '[Fichier partagé]',
//   //       role,
//   //       isFile: true,
//   //       fileUrl,
//   //     });

//   //     setMessages((prev) => [
//   //       ...prev,
//   //       {
//   //         id: uuidv4(),
//   //         senderId,
//   //         message: '[Fichier partagé]',
//   //         isFile: true,
//   //         fileUrl,
//   //         createdAt: new Date(),
//   //       },
//   //     ]);
//   //   }
//   //   e.target.value = null;
//   // };

//   const handleFileChange = async (e) => {
//     if (!e.target.files?.length || !socket) return;

//     const file = e.target.files[0];

//     // Validation du fichier
//     const maxSize = 10 * 1024 * 1024; // 10MB
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];

//     if (file.size > maxSize) {
//       setError('Fichier trop volumineux (max 10MB)');
//       return;
//     }

//     if (!allowedTypes.includes(file.type)) {
//       setError('Type de fichier non autorisé');
//       return;
//     }

//     const fileUrl = await uploadFile(file);

//     if (fileUrl) {
//       const messageData = {
//         senderId,
//         receiverId,
//         message: `[Fichier partagé: ${file.name}]`,
//         role,
//         isFile: true,
//         fileUrl,
//         metadata: {
//           originalName: file.name,
//           size: file.size,
//           mimeType: file.type
//         }
//       };

//       socket.emit('sendMessage', messageData);

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: uuidv4(),
//           ...messageData,
//           createdAt: new Date(),
//         },
//       ]);
//     }
//     e.target.value = null;
//   };

//   const getFileName = (url) => {
//     try {
//       return decodeURIComponent(url.split('/').pop());
//     } catch {
//       return 'Fichier';
//     }
//   };

//   const isImage = (url) => url.match(/\.(jpeg|jpg|png|gif)$/i);
//   const isPDF = (url) => url.match(/\.pdf$/i);

//   if (!admin) return null;

//   // const handleTyping = useCallback(() => {
//   //   if (socket && !typing) {
//   //     setTyping(true);
//   //     socket.emit('typing', { senderId, receiverId });

//   //     setTimeout(() => {
//   //       setTyping(false);
//   //       socket.emit('stopTyping', { senderId, receiverId });
//   //     }, 3000);
//   //   }
//   // }, [socket, typing, senderId, receiverId]);

//   // --- Le rendu (JSX) est entièrement mis à jour pour être "superieur" ---
//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat</h1>
//             <p className="text-gray-600">Connect with your colleagues and students</p>
//           </div>
//         </header>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-2xl p-6 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm font-medium">Active Chats</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm font-medium">Online Users</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-1">8</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a1 1 0 11-2 0 1 1 0 012 0zM7 10a1 1 0 11-2 0 1 1 0 012 0z" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm font-medium">Messages Today</p>
//                 <p className="text-2xl font-bold text-gray-800 mt-1">42</p>
//               </div>
//               <div className="p-3 bg-purple-100 rounded-full">
//                 <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Chat List Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h2 className="text-lg font-bold text-gray-800 mb-4">Active Chats</h2>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
//                   <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
//                     JS
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900">John Smith</p>
//                     <p className="text-sm text-gray-500 truncate">Hello there...</p>
//                   </div>
//                   <span className="text-xs text-gray-400">2m</span>
//                 </div>

//                 <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
//                   <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
//                     ES
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900">Emma Smith</p>
//                     <p className="text-sm text-gray-500 truncate">See you tomorrow</p>
//                   </div>
//                   <span className="text-xs text-gray-400">1h</span>
//                 </div>

//                 <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
//                   <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
//                     MJ
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900">Mike Johnson</p>
//                     <p className="text-sm text-gray-500 truncate">Thanks for the help</p>
//                   </div>
//                   <span className="text-xs text-gray-400">3h</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Chat Window */}
//           <div className="lg:col-span-3">
//             <div className="flex flex-col h-[80vh] w-full max-w-full mx-auto border border-gray-200 rounded-2xl shadow-xl bg-white overflow-hidden">
//               {/* Header du chat - Amélioré avec le design de l'image */}
//               <div className="flex items-center p-4 border-b border-gray-200">
//                 <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
//                   {chatUser ? chatUser.name.charAt(0) : 'JS'}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {chatUser ? chatUser.name : 'John Smith'}
//                   </h3>
//                   <span className={`text-sm ${onlineStatus === 'Online' ? 'text-green-500' : 'text-gray-500'}`}>
//                     {onlineStatus}
//                   </span>
//                 </div>

//                 {!isConnected && (
//                   <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-1 text-sm">
//                     Connexion perdue - Reconnexion en cours...
//                   </div>
//                 )}

//                 {error && (
//                   <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-1 text-sm">
//                     {error}
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//                     <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                     </svg>
//                   </button>
//                   <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//                     <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {typingUser && (
//                 <div className="flex items-start mb-4">
//                   <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
//                     <div className="flex items-center gap-2">
//                       <div className="flex gap-1">
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                       </div>
//                       <span className="text-sm text-gray-500">En train d'écrire...</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Zone des messages - Scrollable et stylisée */}
//               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
//                 {messages.map((m) => (
//                   <div
//                     key={m.id}
//                     className={`flex flex-col ${m.senderId === senderId ? 'items-end' : 'items-start'
//                       }`}
//                   >
//                     <div
//                       className={`max-w-[70%] px-4 py-3 rounded-2xl drop-shadow-sm ${m.senderId === senderId
//                         ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
//                         : 'bg-white text-gray-800 border border-gray-200'
//                         }`}
//                     >
//                       {m.isFile && m.fileUrl ? (
//                         <div className="flex flex-col gap-2">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xl">📎</span>
//                             <a
//                               href={m.fileUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="underline break-all"
//                             >
//                               {getFileName(m.fileUrl)}
//                             </a>
//                           </div>

//                           {isImage(m.fileUrl) && (
//                             <img
//                               src={m.fileUrl}
//                               alt="aperçu"
//                               className="mt-1 max-h-48 w-auto rounded-lg object-contain"
//                             />
//                           )}

//                           {isPDF(m.fileUrl) && (
//                             <div className="border border-gray-300 rounded-md mt-2 p-2 bg-gray-100">
//                               <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js`}>
//                                 <Viewer fileUrl={m.fileUrl} />
//                               </Worker>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <span>{m.message}</span>
//                       )}
//                     </div>
//                     <span className={`mt-1 text-xs text-gray-400 ${m.senderId === senderId ? 'mr-2' : 'ml-2'}`}>
//                       {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
//                     </span>
//                   </div>
//                 ))}
//                 <div ref={chatEndRef} />
//               </div>

//               {/* Input de message et actions - Amélioré pour le style */}
//               <div className="flex items-center p-4 border-t border-gray-200 bg-white gap-2">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
//                 <button
//                   onClick={() => fileInputRef.current.click()}
//                   disabled={uploading}
//                   className="text-xl text-gray-500 hover:text-green-600 transition-colors duration-200"
//                   title="Partager un fichier"
//                 >
//                   📎
//                 </button>
//                 <input
//                   type="text"
//                   placeholder="Type a message..."
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
//                   className="flex-1 border-none rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//                 <button
//                   onClick={sendMessage}
//                   disabled={!message.trim()}
//                   className={`bg-gradient-to-r from-green-500 to-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform duration-200 ${!message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
//                 >
//                   ➤
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

export const Chats = ({ role, senderId, receiverId }) => {
  // États de base
  const [admin, setAdmin] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [onlineStatus, setOnlineStatus] = useState('Offline');
  const [chatUser, setChatUser] = useState(null);

  // États de statut et erreur
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  // État de debugging - À SUPPRIMER EN PRODUCTION
  const [debugMode, setDebugMode] = useState(true);
  const [debugLogs, setDebugLogs] = useState([]);

  // Fonction debug
  const addDebugLog = useCallback((message) => {
    if (!debugMode) return;
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev.slice(-15), logMessage]);
  }, [debugMode]);

  const handleError = useCallback((error) => {
    console.error('Erreur socket:', error);
    addDebugLog(`❌ Erreur: ${error.message || error}`);
    setError('Problème de connexion. Reconnexion en cours...');
    setTimeout(() => setError(null), 3000);
  }, [addDebugLog]);

  // Initialisation de l'admin et du socket
  useEffect(() => {
    addDebugLog('🔄 Initialisation du composant...');
    addDebugLog(`Props reçues: role=${role}, senderId=${senderId}, receiverId=${receiverId}`);
    
    const storedAdmin = JSON.parse(localStorage.getItem('admin'));
    const storedTeacher = JSON.parse(localStorage.getItem('teacher'));
    const storedStudent = JSON.parse(localStorage.getItem('student'));
    const userId = storedAdmin?._id || storedTeacher?._id || storedStudent?._id;

    if (!storedAdmin && !storedTeacher && !storedStudent) {
      addDebugLog('⛔ Aucun utilisateur connecté — redirection vers /home');
      window.location.href = '/home';
      return;
    }

    addDebugLog('✅ utilisateur récupéré:' , userId);
    setAdmin(storedAdmin || storedTeacher || storedStudent);

    // Configuration socket avec debug complet
    addDebugLog('🔌 Tentative de connexion socket...');
    const socketInstance = io('http://localhost:3000', {
      query: { userId: userId },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });

    // Events de debug socket
    socketInstance.on('connect', () => {
      addDebugLog(`✅ Socket connecté avec ID: ${socketInstance.id}`);
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on('disconnect', (reason) => {
      addDebugLog(`❌ Socket déconnecté: ${reason}`);
      setIsConnected(false);
      setError('Connexion perdue');
    });

    socketInstance.on('connect_error', (error) => {
      addDebugLog(`❌ Erreur connexion: ${error.message}`);
      setIsConnected(false);
      handleError(error);
    });

    setSocket(socketInstance);

    return () => {
      addDebugLog('🧹 Nettoyage socket...');
      socketInstance.disconnect();
    };
  }, [addDebugLog, handleError, role, senderId, receiverId]);

  // Gestion des messages et événements socket
  useEffect(() => {
    if (!socket || !senderId || !receiverId) {
      addDebugLog('⚠️ Socket, senderId ou receiverId manquant');
      return;
    }

    addDebugLog(`🏠 Configuration room pour ${senderId} et ${receiverId}`);
    
    // Configuration de la room
    const sortedIds = [senderId, receiverId].sort();
    const room = `${sortedIds[0]}-${sortedIds[1]}`;
    
    addDebugLog(`🏠 Joining room: ${room}`);
    socket.emit('joinRoom', { room, senderId, receiverId });

    // Event: Confirmation de join
    socket.on('joinedRoom', (data) => {
      addDebugLog(`✅ Room rejointe: ${data.room || room}`);
    });

    // Event: Historique des messages
    socket.on('chatHistory', (history) => {
      addDebugLog(`📚 Historique reçu: ${history.length} messages`);
      const formattedHistory = history.map((m) => ({
        ...m,
        id: m._id || uuidv4(),
        createdAt: m.createdAt || new Date()
      }));
      setMessages(formattedHistory);
    });

    // Event: Nouveau message reçu
    socket.on('receiveMessage', (msg) => {
      addDebugLog(`📩 Message reçu de ${msg.senderId}: ${msg.message.substring(0, 50)}...`);
      const formattedMsg = {
        ...msg,
        id: msg._id || uuidv4(),
        createdAt: msg.createdAt || new Date()
      };
      setMessages((prev) => [...prev, formattedMsg]);
    });

    // Event: Statut utilisateur
    socket.on('userStatus', (status) => {
      addDebugLog(`👤 Statut ${status.userId}: ${status.isOnline ? 'Online' : 'Offline'}`);
      if (status.userId === receiverId) {
        setOnlineStatus(status.isOnline ? 'Online' : 'Offline');
      }
    });

    // Events de frappe
    socket.on('userTyping', (data) => {
      if (data.senderId === receiverId) {
        addDebugLog(`⌨️ ${data.senderId} est en train d'écrire`);
        setTypingUser(data.senderId);
        setTimeout(() => setTypingUser(null), 3000);
      }
    });

    socket.on('userStoppedTyping', (data) => {
      if (data.senderId === receiverId) {
        addDebugLog(`⌨️ ${data.senderId} a arrêté d'écrire`);
        setTypingUser(null);
      }
    });

    // Event: Erreur générique
    socket.on('error', (error) => {
      addDebugLog(`❌ Erreur socket: ${error}`);
      handleError(error);
    });

    // Récupération des infos utilisateur
    if (receiverId && databaseUri) {
      addDebugLog(`👤 Récupération infos utilisateur: ${receiverId}`);
      axios.get(`${databaseUri}/users/${receiverId}`)
        .then(res => {
          addDebugLog(`✅ Utilisateur récupéré: ${res.data.name || res.data._id}`);
          setChatUser(res.data);
        })
        .catch(err => {
          addDebugLog(`❌ Erreur récupération utilisateur: ${err.message}`);
          console.error('Erreur récupération utilisateur:', err);
        });
    }

    return () => {
      addDebugLog('🧹 Nettoyage événements socket...');
      socket.off('joinedRoom');
      socket.off('chatHistory');
      socket.off('receiveMessage');
      socket.off('userStatus');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('error');
    };
  }, [socket, senderId, receiverId, databaseUri, handleError, addDebugLog]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fonction de validation des messages
  const validateMessage = (msg) => {
    if (!msg || msg.trim().length === 0) return false;
    if (msg.length > 1000) return false;
    return true;
  };

  const sanitizeMessage = (msg) => {
    return msg.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  // Fonction d'envoi de message CORRIGÉE
  const sendMessage = () => {
    addDebugLog(`📤 Tentative d'envoi: "${message}"`);
    
    // Vérifications préliminaires
    if (!socket) {
      addDebugLog('❌ Socket non disponible');
      setError('Socket non connecté');
      return;
    }

    if (!isConnected) {
      addDebugLog('❌ Socket non connecté');
      setError('Connexion perdue');
      return;
    }

    if (!senderId || !receiverId) {
      addDebugLog(`❌ IDs manquants: senderId=${senderId}, receiverId=${receiverId}`);
      setError('Informations d\'utilisateur manquantes');
      return;
    }

    const sanitizedMessage = sanitizeMessage(message);
    
    if (!validateMessage(sanitizedMessage)) {
      addDebugLog('❌ Message invalide après sanitisation');
      setError('Message invalide');
      return;
    }

    // Données du message
    const messageData = {
      senderId,
      receiverId,
      message: sanitizedMessage,
      role,
      timestamp: new Date().toISOString(),
    };

    addDebugLog(`📤 Envoi message: ${JSON.stringify(messageData, null, 2)}`);

    // Émettre le message
    socket.emit('sendMessage', messageData, (response) => {
      if (response && response.error) {
        addDebugLog(`❌ Erreur serveur: ${response.error}`);
        setError('Erreur lors de l\'envoi');
      } else {
        addDebugLog('✅ Message envoyé avec succès');
      }
    });

    // Ajouter immédiatement à l'interface
    const localMessage = {
      id: uuidv4(),
      ...messageData,
      createdAt: new Date()
    };
    
    setMessages((prev) => {
      addDebugLog(`📝 Ajout message local: ${prev.length} -> ${prev.length + 1} messages`);
      return [...prev, localMessage];
    });
    
    setMessage('');

    // Arrêter l'indicateur de frappe
    if (typing) {
      setTyping(false);
      socket.emit('stopTyping', { senderId, receiverId });
    }
  };

  // Fonction de gestion de frappe
  const handleTyping = useCallback(() => {
    if (socket && !typing) {
      setTyping(true);
      socket.emit('typing', { senderId, receiverId });
      
      setTimeout(() => {
        setTyping(false);
        socket.emit('stopTyping', { senderId, receiverId });
      }, 3000);
    }
  }, [socket, typing, senderId, receiverId]);

  // Upload de fichier
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await axios.post(
        `${databaseUri}/chat/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setUploading(false);
      addDebugLog(`✅ Fichier uploadé: ${res.data.url}`);
      return res.data.url;
    } catch (err) {
      setUploading(false);
      addDebugLog(`❌ Erreur upload: ${err.message}`);
      console.error('Erreur upload:', err);
      setError('Erreur lors de l\'upload');
      return null;
    }
  };

  const handleFileChange = async (e) => {
    if (!e.target.files?.length || !socket) return;

    const file = e.target.files[0];

    // Validation du fichier
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];

    if (file.size > maxSize) {
      setError('Fichier trop volumineux (max 10MB)');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non autorisé');
      return;
    }

    const fileUrl = await uploadFile(file);

    if (fileUrl) {
      const messageData = {
        senderId,
        receiverId,
        message: `[Fichier partagé: ${file.name}]`,
        role,
        isFile: true,
        fileUrl,
        metadata: {
          originalName: file.name,
          size: file.size,
          mimeType: file.type
        }
      };

      socket.emit('sendMessage', messageData);

      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          ...messageData,
          createdAt: new Date(),
        },
      ]);
    }
    e.target.value = null;
  };

  const getFileName = (url) => {
    try {
      return decodeURIComponent(url.split('/').pop());
    } catch {
      return 'Fichier';
    }
  };

  const isImage = (url) => url.match(/\.(jpeg|jpg|png|gif)$/i);
  const isPDF = (url) => url.match(/\.pdf$/i);

  // Fonction de test des connexions
  const testConnections = () => {
    addDebugLog('🧪 Test des connexions...');
    addDebugLog(`Socket: ${socket ? 'OK' : 'KO'}`);
    addDebugLog(`Socket connecté: ${isConnected}`);
    addDebugLog(`Admin: ${admin ? 'OK' : 'KO'}`);
    addDebugLog(`SenderId: ${senderId || 'KO'}`);
    addDebugLog(`ReceiverId: ${receiverId || 'KO'}`);
    addDebugLog(`Database URI: ${databaseUri || 'KO'}`);
    
    if (socket) {
      addDebugLog(`Socket ID: ${socket.id}`);
      addDebugLog(`Socket connected: ${socket.connected}`);
    }
  };

  if (!admin) return <div>Chargement...</div>;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* DEBUG PANEL - À SUPPRIMER EN PRODUCTION */}
        {debugMode && (
          <div className="bg-black text-green-400 p-4 rounded-lg mb-4 text-xs font-mono max-h-48 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-yellow-400">DEBUG MODE</h3>
              <div className="flex gap-2">
                <button 
                  onClick={testConnections}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                >
                  Test
                </button>
                <button 
                  onClick={() => setDebugMode(false)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {debugLogs.map((log, i) => (
                <div key={i} className="text-xs">{log}</div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-600 text-xs">
              <div>Socket: {socket ? '✅' : '❌'} | Connecté: {isConnected ? '✅' : '❌'}</div>
              <div>Messages: {messages.length} | Admin: {admin ? '✅' : '❌'}</div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat</h1>
            <p className="text-gray-600">Connect with your colleagues and students</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Chats</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Online Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">8</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a1 1 0 11-2 0 1 1 0 012 0zM7 10a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Messages Today</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">42</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Active Chats</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    JS
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">John Smith</p>
                    <p className="text-sm text-gray-500 truncate">Hello there...</p>
                  </div>
                  <span className="text-xs text-gray-400">2m</span>
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    ES
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">Emma Smith</p>
                    <p className="text-sm text-gray-500 truncate">See you tomorrow</p>
                  </div>
                  <span className="text-xs text-gray-400">1h</span>
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    MJ
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">Mike Johnson</p>
                    <p className="text-sm text-gray-500 truncate">Thanks for the help</p>
                  </div>
                  <span className="text-xs text-gray-400">3h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            <div className="flex flex-col h-[80vh] w-full max-w-full mx-auto border border-gray-200 rounded-2xl shadow-xl bg-white overflow-hidden">
              
              {/* Header du chat avec indicateurs de statut */}
              <div className="relative flex items-center p-4 border-b border-gray-200">
                {/* Indicateurs d'erreur */}
                {!isConnected && (
                  <div className="absolute -top-4 left-0 right-0 bg-red-500 text-white text-center py-1 text-sm z-10">
                    Connexion perdue - Reconnexion en cours...
                  </div>
                )}

                {error && (
                  <div className="absolute -top-4 left-0 right-0 bg-orange-500 text-white text-center py-1 text-sm z-10">
                    {error}
                  </div>
                )}

                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {chatUser ? chatUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {chatUser ? chatUser.name : 'Utilisateur'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected && onlineStatus === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className={`text-sm ${onlineStatus === 'Online' && isConnected ? 'text-green-500' : 'text-gray-500'}`}>
                      {isConnected ? onlineStatus : 'Hors ligne'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Zone des messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {/* Indicateur de frappe */}
                {typingUser && (
                  <div className="flex items-start">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500">En train d'écrire...</span>
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.senderId === senderId ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl drop-shadow-sm ${m.senderId === senderId
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                    >
                      {m.isFile && m.fileUrl ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">📎</span>
                            <a
                              href={m.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`underline break-all ${m.senderId === senderId ? 'text-white' : 'text-blue-600'}`}
                            >
                              {m.metadata?.originalName || getFileName(m.fileUrl)}
                            </a>
                            {m.metadata?.size && (
                              <span className={`text-xs ${m.senderId === senderId ? 'text-gray-200' : 'text-gray-500'}`}>
                                ({(m.metadata.size / 1024).toFixed(1)} KB)
                              </span>
                            )}
                          </div>

                          {isImage(m.fileUrl) && (
                            <img
                              src={m.fileUrl}
                              alt="aperçu"
                              className="mt-1 max-h-48 w-auto rounded-lg object-contain cursor-pointer"
                              onClick={() => window.open(m.fileUrl, '_blank')}
                            />
                          )}

                          {isPDF(m.fileUrl) && (
                            <div className="border border-gray-300 rounded-md mt-2 p-2 bg-gray-100">
                              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
                                <Viewer fileUrl={m.fileUrl} />
                              </Worker>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span>{m.message}</span>
                      )}
                    </div>
                    <span className={`mt-1 text-xs text-gray-400 ${m.senderId === senderId ? 'mr-2' : 'ml-2'}`}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                ))}
                
                {/* Message si aucun message */}
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">Aucun message</p>
                      <p className="text-sm">Commencez une conversation</p>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Input de message et actions */}
              <div className="flex items-center p-4 border-t border-gray-200 bg-white gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.txt,.doc,.docx"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || !isConnected}
                  className={`text-xl transition-colors duration-200 ${uploading || !isConnected 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:text-green-600'
                  }`}
                  title={uploading ? "Upload en cours..." : "Partager un fichier"}
                >
                  {uploading ? '⏳' : '📎'}
                </button>
                
                <input
                  type="text"
                  placeholder={isConnected ? "Tapez votre message..." : "Connexion en cours..."}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={!isConnected}
                  className={`flex-1 border-none rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 ${!isConnected ? 'cursor-not-allowed opacity-50' : ''}`}
                />
                
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || !isConnected}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform duration-200 ${
                    !message.trim() || !isConnected 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105'
                  }`}
                  title={!isConnected ? "Connexion requise" : "Envoyer le message"}
                >
                  {!isConnected ? '⏸️' : '➤'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};