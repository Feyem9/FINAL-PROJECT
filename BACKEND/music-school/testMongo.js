const mongoose = require('mongoose');

const uri = 'mongodb+srv://feyemlionel:Feyem@blog.oxy0qqt.mongodb.net/music-school?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connexion réussie à MongoDB !'))
  .catch(err => console.error('❌ Erreur de connexion :', err));
