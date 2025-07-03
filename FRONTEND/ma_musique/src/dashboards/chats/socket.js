import { io } from 'socket.io-client';

// 👇 Mets ton URL backend ici
const socket = io('http://localhost:3000', {
  query: { userId: 'admin123' }, // Optionnel : identifiant unique du user connecté
});

export default socket;
