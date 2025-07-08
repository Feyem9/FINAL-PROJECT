import { io } from 'socket.io-client';


      const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


// 👇 Mets ton URL backend ici
const socket = io(`${databaseUri}`, {
  query: { userId: 'admin123' }, // Optionnel : identifiant unique du user connecté
});

export default socket;
