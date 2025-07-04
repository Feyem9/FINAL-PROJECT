import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const admin = JSON.parse(localStorage.getItem('admin'));
console.log('admin' , admin);

const monIdDuUser = admin._id;
console.log('monidduuser' , monIdDuUser);


const socket = io('http://localhost:3000', {
  query: { userId: monIdDuUser },
});

export const Chats = ({ role, senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!senderId || !receiverId) return;

    const sortedIds = [senderId, receiverId].sort();
    const room = `${sortedIds[0]}-${sortedIds[1]}`;

    socket.emit('joinRoom', { room, senderId, receiverId });

    socket.on('chatHistory', (history) => {
      setMessages(history.map((m) => ({ ...m, id: m._id || uuidv4() })));
    });

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, { ...msg, id: uuidv4() }]);
    });

    return () => {
      socket.off('chatHistory');
      socket.off('receiveMessage');
    };
  }, [senderId, receiverId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('sendMessage', {
      senderId,
      receiverId,
      message,
      role,
    });

    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), senderId, message },
    ]);

    setMessage('');
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await axios.post(
        'http://localhost:3000/chat/upload',
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
    if (!e.target.files?.length) return;
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

  const isImage = (url) => {
    return url.match(/\.(jpeg|jpg|png|gif)$/i);
  };

  const isPDF = (url) => {
    return url.match(/\.pdf$/i);
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] w-full max-w-md mx-auto border border-gray-300 rounded-md shadow-md bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-md font-bold">
        Chat - {role}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[70%] px-4 py-2 rounded-2xl ${
              m.senderId === senderId
                ? 'ml-auto bg-green-200'
                : 'mr-auto bg-white border'
            }`}
          >
            {m.isFile && m.fileUrl ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-700">
                  📎
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
                    className="mt-1 max-h-48 rounded-md"
                  />
                )}

                {isPDF(m.fileUrl) && (
                  <div className="border mt-2">
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
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center p-4 border-t border-gray-300 bg-white gap-2">
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          className="text-xl"
          title="Partager un fichier"
        >
          📎
        </button>
        <input
          type="text"
          placeholder="Écris ton message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded-full"
        >
          ➤
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
