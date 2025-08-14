// // const axios = require('axios');
// // const { MongoClient } = require('mongodb');
// // require('dotenv').config(); // si tu n’utilises pas encore dotenv

// // // Remplace par ton URI Atlas (depuis MongoDB Atlas → Connect → Connect your application)
// // // const MONGODB_URI = 'mongodb+srv://<user>:<password>@cluster0.mongodb.net/museschoolDB?retryWrites=true&w=majority';
// // // const MONGODB_URI = process.env.MONGO_URI;
// // // MONGODB_URI=mongodb+srv://feyemlionel:Feyem@blog.oxy0qqt.mongodb.net/music-school?retryWrites=true&w=majority
// // const MONGODB_URI = 'mongodb+srv://feyemlionel:Feyem@blog.oxy0qqt.mongodb.net/music-school?retryWrites=true&w=majority';

// // // console.log('MONGO_URI:', process.env.MONGO_URI);

// // const client = new MongoClient(MONGODB_URI);

// // const EVENTBRITE_PUBLIC_TOKEN = '7GLAFWB434MYI5TUFYTU'

// // // Mots-clés à rechercher
// // const keywords = ['concert', 'atelier', 'conservatoire', 'rencontre musicale'];

// // async function fetchMusicEvents() {
// //   try {
// //     await client.connect();
// //     const db = client.db('music-school');
// //     const collection = db.collection('annonces');

// //     let allEvents = [];

// //     for (let keyword of keywords) {
// //       const response = await axios.get('https://www.eventbriteapi.com/v3/events/search/', {
// //         params: {
// //           q: keyword,
// //           'categories': '103', // musique
// //           'location.address': 'France',
// //           'expand': 'venue,logo'
// //         },
// //         headers: {
// //           'Authorization': `Bearer ${EVENTBRITE_TOKEN}`
// //         }
// //       });

// //       if (response.data.events && response.data.events.length > 0) {
// //         const events = response.data.events.map(event => ({
// //           titre: event.name.text,
// //           description: event.description?.text || 'Pas de description',
// //           type: event.category_id === '103' ? 'Concert/Atelier' : 'Autre',
// //           lieu: event.venue?.address?.localized_address_display || 'En ligne',
// //           date: new Date(event.start.utc),
// //           image: event.logo?.url || null,
// //           url: event.url,
// //           createdAt: new Date()
// //         }));
// //         allEvents = allEvents.concat(events);
// //       }
// //     }

// //     if (allEvents.length === 0) {
// //       console.log('Aucun événement trouvé pour les mots-clés définis.');
// //     } else {
// //       await collection.insertMany(allEvents);
// //       console.log(`${allEvents.length} événements insérés dans MongoDB Atlas !`);
// //     }

// //   } catch (error) {
// //     console.error('Erreur :', error.response?.data || error.message);
// //   } finally {
// //     await client.close();
// //   }
// // }

// // fetchMusicEvents();

// const axios = require('axios');
// const { MongoClient } = require('mongodb');
// require('dotenv').config(); // charger les variables d'environnement

// const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://feyemlionel:Feyem@blog.oxy0qqt.mongodb.net/music-school?retryWrites=true&w=majority';
// const client = new MongoClient(MONGODB_URI);

// // Utilise le même token que tu as défini
// const EVENTBRITE_PUBLIC_TOKEN = process.env.EVENTBRITE_PUBLIC_TOKEN || '7GLAFWB434MYI5TUFYTU';

// // Mots-clés à rechercher
// const keywords = ['concert', 'atelier', 'conservatoire', 'rencontre musicale'];

// async function fetchMusicEvents() {
//   try {
//     await client.connect();
//     const db = client.db('music-school');
//     const collection = db.collection('annonces');

//     let allEvents = [];

//     for (let keyword of keywords) {
//       const response = await axios.get('https://www.eventbriteapi.com/v3/events/search', {
//         params: {
//           q: keyword,
//           'categories': '103', // musique
//           'location.address': 'France',
//           'expand': 'venue,logo'
//         },
//         headers: {
//           'Authorization': `Bearer ${EVENTBRITE_PUBLIC_TOKEN}` // ⚡ ici le bon token
//         }
//       });

//       if (response.data.events && response.data.events.length > 0) {
//         const events = response.data.events.map(event => ({
//           titre: event.name.text,
//           description: event.description?.text || 'Pas de description',
//           type: event.category_id === '103' ? 'Concert/Atelier' : 'Autre',
//           lieu: event.venue?.address?.localized_address_display || 'En ligne',
//           date: new Date(event.start.utc),
//           image: event.logo?.url || null,
//           url: event.url,
//           createdAt: new Date()
//         }));
//         allEvents = allEvents.concat(events);
//       }
//     }

//     if (allEvents.length === 0) {
//       console.log('Aucun événement trouvé pour les mots-clés définis.');
//     } else {
//       await collection.insertMany(allEvents);
//       console.log(`${allEvents.length} événements insérés dans MongoDB Atlas !`);
//     }

//   } catch (error) {
//     console.error('Erreur :', error.response?.data || error.message);
//   } finally {
//     await client.close();
//   }
// }

// fetchMusicEvents();

// fetchMusicEvents.js
const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config(); // charge les variables d'environnement depuis .env

// --- CONFIG MONGODB ---
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://feyemlionel:Feyem@blog.oxy0qqt.mongodb.net/music-school?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI);

// --- CONFIG EVENTBRITE ---
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN || 'TON_TOKEN_PRIVÉ';
const keywords = ['concert', 'atelier', 'conservatoire', 'rencontre musicale'];

async function fetchMusicEvents() {
  try {
    await client.connect();
    const db = client.db('music-school');
    const collection = db.collection('annonces');

    let allEvents = [];

    for (const keyword of keywords) {
      const response = await axios.get('https://www.eventbriteapi.com/v3/events/search', {
        params: {
          q: keyword,
          'categories': '103', // musique
          'location.address': 'France',
          'expand': 'venue,logo'
        },
        headers: {
          'Authorization': `Bearer ${EVENTBRITE_TOKEN}`
        }
      });

      if (response.data.events && response.data.events.length > 0) {
        const events = response.data.events.map(event => ({
          titre: event.name?.text || 'Sans titre',
          description: event.description?.text || 'Pas de description',
          type: event.category_id === '103' ? 'Concert/Atelier' : 'Autre',
          lieu: event.venue?.address?.localized_address_display || 'En ligne',
          date: event.start?.utc ? new Date(event.start.utc) : null,
          image: event.logo?.url || null,
          url: event.url || null,
          createdAt: new Date()
        }));
        allEvents = allEvents.concat(events);
      }
    }

    if (allEvents.length === 0) {
      console.log('Aucun événement trouvé pour les mots-clés définis.');
    } else {
      const result = await collection.insertMany(allEvents);
      console.log(`${result.insertedCount} événements insérés dans MongoDB Atlas !`);
    }

  } catch (error) {
    console.error('Erreur :', error.response?.data || error.message);
  } finally {
    await client.close();
  }
}

fetchMusicEvents();
