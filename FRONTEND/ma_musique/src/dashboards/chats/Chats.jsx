// // import React, { useState, useEffect, useRef } from 'react';
// // import io from 'socket.io-client';
// // import axios from 'axios';
// // import { v4 as uuidv4 } from 'uuid';
// // import { Worker, Viewer } from '@react-pdf-viewer/core';
// // import '@react-pdf-viewer/core/lib/styles/index.css';

// // const admin = JSON.parse(localStorage.getItem('admin'));
// // const role = JSON.parse(localStorage.getItem('role'));
// // console.log('admin' , admin);
// //           const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

// // let monIdDuUser = null;

// // if (admin) {

// //       // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;



// //   // const monIdDuUser = null;
// //   monIdDuUser = admin._id;
// //   console.log(monIdDuUser);


// // }else{
// //    console.log('⛔ Pas connecté');
// //   // Redirige vers page login ou page d'accueil publique :
// //   window.location.href = '/home';
// // }

// // console.log('monidduuser' , monIdDuUser);


// // const socket = io('http://localhost:3000', {   
// //   query: { userId: monIdDuUser },
// // });

// // export const Chats = ({ role, senderId, receiverId }) => {
// //   const [messages, setMessages] = useState([]);
// //   const [message, setMessage] = useState('');
// //   const [uploading, setUploading] = useState(false);
// //   const fileInputRef = useRef(null);
// //   const chatEndRef = useRef(null);

// //   useEffect(() => {
// //     if (!senderId || !receiverId) return;

// //     const sortedIds = [senderId, receiverId].sort();
// //     const room = `${sortedIds[0]}-${sortedIds[1]}`;

// //     socket.emit('joinRoom', { room, senderId, receiverId });

// //     socket.on('chatHistory', (history) => {
// //       setMessages(history.map((m) => ({ ...m, id: m._id || uuidv4() })));
// //     });

// //     socket.on('receiveMessage', (msg) => {
// //       setMessages((prev) => [...prev, { ...msg, id: uuidv4() }]);
// //     });

// //     return () => {
// //       socket.off('chatHistory');
// //       socket.off('receiveMessage');
// //     };
// //   }, [senderId, receiverId]);

// //   useEffect(() => {
// //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [messages]);

// //   const sendMessage = () => {
// //     if (!message.trim()) return;

// //     socket.emit('sendMessage', {
// //       senderId,
// //       receiverId,
// //       message,
// //       role,
// //     });

// //     setMessages((prev) => [
// //       ...prev,
// //       { id: uuidv4(), senderId, message },
// //     ]);

// //     setMessage('');
// //   };

// //   const uploadFile = async (file) => {
// //     const formData = new FormData();
// //     formData.append('file', file);
// //     setUploading(true);

// //     try {
// //       const res = await axios.post(
// //         `${databaseUri}/chat/upload`,
// //         formData,
// //         { headers: { 'Content-Type': 'multipart/form-data' } }
// //       );
// //       setUploading(false);
// //       return res.data.url;
// //     } catch (err) {
// //       setUploading(false);
// //       console.error('Erreur upload:', err);
// //       alert('Erreur upload');
// //       return null;
// //     }
// //   };

// //   const handleFileChange = async (e) => {
// //     if (!e.target.files?.length) return;
// //     const file = e.target.files[0];
// //     const fileUrl = await uploadFile(file);

// //     if (fileUrl) {
// //       socket.emit('sendMessage', {
// //         senderId,
// //         receiverId,
// //         message: '[Fichier partagé]',
// //         role,
// //         isFile: true,
// //         fileUrl,
// //       });

// //       setMessages((prev) => [
// //         ...prev,
// //         {
// //           id: uuidv4(),
// //           senderId,
// //           message: '[Fichier partagé]',
// //           isFile: true,
// //           fileUrl,
// //         },
// //       ]);
// //     }
// //     e.target.value = null;
// //   };

// //   const getFileName = (url) => {
// //     try {
// //       return decodeURIComponent(url.split('/').pop());
// //     } catch {
// //       return 'Fichier';
// //     }
// //   };

// //   const isImage = (url) => {
// //     return url.match(/\.(jpeg|jpg|png|gif)$/i);
// //   };

// //   const isPDF = (url) => {
// //     return url.match(/\.pdf$/i);
// //   };

// //   return (
// //     <div className="flex flex-col h-full max-h-[600px] w-full max-w-md mx-auto border border-gray-300 rounded-md shadow-md bg-white">
// //       {/* Header */}
// //       <div className="bg-green-600 text-white p-4 rounded-t-md font-bold">
// //         Chat - {role}
// //       </div>

// //       {/* Messages */}
// //       <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
// //         {messages.map((m) => (
// //           <div
// //             key={m.id}
// //             className={`max-w-[70%] px-4 py-2 rounded-2xl ${
// //               m.senderId === senderId
// //                 ? 'ml-auto bg-green-200'
// //                 : 'mr-auto bg-white border'
// //             }`}
// //           >
// //             {m.isFile && m.fileUrl ? (
// //               <div className="flex flex-col gap-2">
// //                 <div className="flex items-center gap-2 text-green-700">
// //                   📎
// //                   <a
// //                     href={m.fileUrl}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                     className="underline break-all"
// //                   >
// //                     {getFileName(m.fileUrl)}
// //                   </a>
// //                 </div>

// //                 {isImage(m.fileUrl) && (
// //                   <img
// //                     src={m.fileUrl}
// //                     alt="aperçu"
// //                     className="mt-1 max-h-48 rounded-md"
// //                   />
// //                 )}

// //                 {isPDF(m.fileUrl) && (
// //                   <div className="border mt-2">
// //                     <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js`}>
// //                       <Viewer fileUrl={m.fileUrl} />
// //                     </Worker>
// //                   </div>
// //                 )}
// //               </div>
// //             ) : (
// //               <span>{m.message}</span>
// //             )}
// //           </div>
// //         ))}
// //         <div ref={chatEndRef} />
// //       </div>

// //       {/* Input */}
// //       <div className="flex items-center p-4 border-t border-gray-300 bg-white gap-2">
// //         <button
// //           onClick={() => fileInputRef.current.click()}
// //           disabled={uploading}
// //           className="text-xl"
// //           title="Partager un fichier"
// //         >
// //           📎
// //         </button>
// //         <input
// //           type="text"
// //           placeholder="Écris ton message..."
// //           value={message}
// //           onChange={(e) => setMessage(e.target.value)}
// //           className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
// //         />
// //         <button
// //           onClick={sendMessage}
// //           disabled={!message.trim()}
// //           className="bg-green-600 text-white px-4 py-2 rounded-full"
// //         >
// //           ➤
// //         </button>
// //         <input
// //           type="file"
// //           ref={fileInputRef}
// //           className="hidden"
// //           onChange={handleFileChange}
// //         />
// //       </div>
// //     </div>
// //   );
// // };
// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { Worker, Viewer } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';

// const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

// export const Chats = ({ role, senderId, receiverId }) => {
//   const [admin, setAdmin] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     const storedAdmin = JSON.parse(localStorage.getItem('admin'));

//     if (!storedAdmin) {
//       console.warn('⛔ Admin non connecté — redirection vers /home');
//       window.location.href = '/home';
//       return;
//     }

//     setAdmin(storedAdmin);

//     const socketInstance = io('http://localhost:3000', {
//       query: { userId: storedAdmin._id },
//     });

//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!socket || !senderId || !receiverId) return;

//     const sortedIds = [senderId, receiverId].sort();
//     const room = `${sortedIds[0]}-${sortedIds[1]}`;

//     socket.emit('joinRoom', { room, senderId, receiverId });

//     socket.on('chatHistory', (history) => {
//       setMessages(history.map((m) => ({ ...m, id: m._id || uuidv4() })));
//     });

//     socket.on('receiveMessage', (msg) => {
//       setMessages((prev) => [...prev, { ...msg, id: uuidv4() }]);
//     });

//     return () => {
//       socket.off('chatHistory');
//       socket.off('receiveMessage');
//     };
//   }, [socket, senderId, receiverId]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = () => {
//     if (!message.trim() || !socket) return;

//     socket.emit('sendMessage', {
//       senderId,
//       receiverId,
//       message,
//       role,
//     });

//     setMessages((prev) => [...prev, { id: uuidv4(), senderId, message }]);
//     setMessage('');
//   };

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

//   const handleFileChange = async (e) => {
//     if (!e.target.files?.length || !socket) return;
//     const file = e.target.files[0];
//     const fileUrl = await uploadFile(file);

//     if (fileUrl) {
//       socket.emit('sendMessage', {
//         senderId,
//         receiverId,
//         message: '[Fichier partagé]',
//         role,
//         isFile: true,
//         fileUrl,
//       });

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: uuidv4(),
//           senderId,
//           message: '[Fichier partagé]',
//           isFile: true,
//           fileUrl,
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

//   if (!admin) return null; // ou un écran de chargement

//   return (
//     <div className="flex flex-col h-full max-h-[600px] w-full max-w-md mx-auto border border-gray-300 rounded-md shadow-md bg-white">
//       {/* Header */}
//       <div className="bg-green-600 text-white p-4 rounded-t-md font-bold">
//         Chat - {role}
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
//         {messages.map((m) => (
//           <div
//             key={m.id}
//             className={`max-w-[70%] px-4 py-2 rounded-2xl ${
//               m.senderId === senderId
//                 ? 'ml-auto bg-green-200'
//                 : 'mr-auto bg-white border'
//             }`}
//           >
//             {m.isFile && m.fileUrl ? (
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center gap-2 text-green-700">
//                   📎
//                   <a
//                     href={m.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline break-all"
//                   >
//                     {getFileName(m.fileUrl)}
//                   </a>
//                 </div>

//                 {isImage(m.fileUrl) && (
//                   <img
//                     src={m.fileUrl}
//                     alt="aperçu"
//                     className="mt-1 max-h-48 rounded-md"
//                   />
//                 )}

//                 {isPDF(m.fileUrl) && (
//                   <div className="border mt-2">
//                     <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js`}>
//                       <Viewer fileUrl={m.fileUrl} />
//                     </Worker>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <span>{m.message}</span>
//             )}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input */}
//       <div className="flex items-center p-4 border-t border-gray-300 bg-white gap-2">
//         <button
//           onClick={() => fileInputRef.current.click()}
//           disabled={uploading}
//           className="text-xl"
//           title="Partager un fichier"
//         >
//           📎
//         </button>
//         <input
//           type="text"
//           placeholder="Écris ton message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
//         />
//         <button
//           onClick={sendMessage}
//           disabled={!message.trim()}
//           className="bg-green-600 text-white px-4 py-2 rounded-full"
//         >
//           ➤
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           onChange={handleFileChange}
//         />
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

export const Chats = ({ role, senderId, receiverId }) => {
  // --- Tes hooks d'état et d'effets restent inchangés ---
  const [admin, setAdmin] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [onlineStatus, setOnlineStatus] = useState('Offline'); // État pour le statut en ligne
  const [chatUser, setChatUser] = useState(null); // État pour l'utilisateur du chat

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('admin'));

    if (!storedAdmin) {
      console.warn('⛔ Admin non connecté — redirection vers /home');
      window.location.href = '/home';
      return;
    }
    setAdmin(storedAdmin);

    // Initialisation du socket
    const socketInstance = io('http://localhost:3000', {
      query: { userId: storedAdmin._id },
    });
    setSocket(socketInstance);

    // Déconnexion
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !senderId || !receiverId) return;

    // Logique pour la gestion de la room et l'historique des messages
    const sortedIds = [senderId, receiverId].sort();
    const room = `${sortedIds[0]}-${sortedIds[1]}`;
    socket.emit('joinRoom', { room, senderId, receiverId });
    socket.on('chatHistory', (history) => {
      setMessages(history.map((m) => ({ ...m, id: m._id || uuidv4() })));
    });

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, { ...msg, id: uuidv4() }]);
    });

    // Écoute des événements de statut en ligne
    socket.on('userStatus', (status) => {
      if (status.userId === receiverId) {
        setOnlineStatus(status.isOnline ? 'Online' : 'Offline');
      }
    });

    // Récupérer les infos de l'utilisateur du chat (receiverId)
    // C'est une hypothèse, tu devras adapter l'URL à ton API
    axios.get(`${databaseUri}/users/${receiverId}`)
      .then(res => setChatUser(res.data))
      .catch(err => console.error(err));

    return () => {
      socket.off('chatHistory');
      socket.off('receiveMessage');
      socket.off('userStatus');
    };
  }, [socket, senderId, receiverId, databaseUri]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    // Logique d'envoi de message
    socket.emit('sendMessage', {
      senderId,
      receiverId,
      message,
      role,
    });
    setMessages((prev) => [...prev, { id: uuidv4(), senderId, message, createdAt: new Date() }]);
    setMessage('');
  };

  // --- Les fonctions d'upload de fichiers restent inchangées ---
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
      return res.data.url;
    } catch (err) {
      setUploading(false);
      console.error('Erreur upload:', err);
      alert('Erreur upload');
      return null;
    }
  };

  const handleFileChange = async (e) => {
    if (!e.target.files?.length || !socket) return;
    const file = e.target.files[0];
    const fileUrl = await uploadFile(file);

    if (fileUrl) {
      socket.emit('sendMessage', {
        senderId,
        receiverId,
        message: '[Fichier partagé]',
        role,
        isFile: true,
        fileUrl,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          senderId,
          message: '[Fichier partagé]',
          isFile: true,
          fileUrl,
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

  if (!admin) return null;

  // --- Le rendu (JSX) est entièrement mis à jour pour être "superieur" ---
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
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
              {/* Header du chat - Amélioré avec le design de l'image */}
              <div className="flex items-center p-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {chatUser ? chatUser.name.charAt(0) : 'JS'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {chatUser ? chatUser.name : 'John Smith'}
                  </h3>
                  <span className={`text-sm ${onlineStatus === 'Online' ? 'text-green-500' : 'text-gray-500'}`}>
                    {onlineStatus}
                  </span>
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

              {/* Zone des messages - Scrollable et stylisée */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.senderId === senderId ? 'items-end' : 'items-start'
                      }`}
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
                              className="underline break-all"
                            >
                              {getFileName(m.fileUrl)}
                            </a>
                          </div>

                          {isImage(m.fileUrl) && (
                            <img
                              src={m.fileUrl}
                              alt="aperçu"
                              className="mt-1 max-h-48 w-auto rounded-lg object-contain"
                            />
                          )}

                          {isPDF(m.fileUrl) && (
                            <div className="border border-gray-300 rounded-md mt-2 p-2 bg-gray-100">
                              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js`}>
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
                <div ref={chatEndRef} />
              </div>

              {/* Input de message et actions - Amélioré pour le style */}
              <div className="flex items-center p-4 border-t border-gray-200 bg-white gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                  className="text-xl text-gray-500 hover:text-green-600 transition-colors duration-200"
                  title="Partager un fichier"
                >
                  📎
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                  className="flex-1 border-none rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`bg-gradient-to-r from-green-500 to-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform duration-200 ${!message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};