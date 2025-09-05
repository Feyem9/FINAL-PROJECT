import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from 'axios';
import Login from "./Login";

const Request = () => {
  // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
  // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    role: "",
    level: "",
    speciality: "",
    experience: "",
    instrument: "",
  });
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setError("");
    setSuccessMsg("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    setError("");
    setSuccessMsg("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Merci de télécharger un fichier PDF valide.");
        setCertificate(null);
        return;
      }
      // Vérifier la taille du fichier (exemple: max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Le fichier PDF ne peut pas dépasser 5MB.");
        setCertificate(null);
        return;
      }
      setCertificate(file);
    }
  };

  const validateForm = () => {
    const { name, email, contact, password, role } = formData;
    if (!name || !email || !contact || !password || !role) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return false;
    }

    // Validation du mot de passe
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }

    if (role === "student" && (!formData.level || !formData.instrument)) {
      setError("Veuillez sélectionner le niveau d'étude et l'instrument.");
      return false;
    }
    if (role === "teacher" && (!formData.speciality || !formData.experience)) {
      setError("Veuillez renseigner votre spécialité et vos années d'expérience.");
      return false;
    }
    if (role === "teacher" && !certificate) {
      setError("Le certificat PDF est obligatoire pour les enseignants.");
      return false;
    }
    return true;
  };

  // Fonction pour stocker les données utilisateur dans le localStorage
  const storeUserData = (userData) => {
    try {
      // Stocker les informations de base de l'utilisateur
      const userInfo = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        registeredAt: new Date().toISOString(),
        // Ajouter des données spécifiques selon le rôle
        ...(userData.role === "student" && {
          level: userData.level,
          instrument: userData.instrument
        }),
        ...(userData.role === "teacher" && {
          speciality: userData.speciality,
          experience: userData.experience
        })
      };

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('isRegistered', 'true');
      localStorage.setItem(`${userData.role}Id`, userData.id);
      console.log('id Données utilisateur stockées dans localStorage:', userData.id);


      console.log('Données utilisateur stockées dans localStorage:', userInfo);
    } catch (error) {
      console.error('Erreur lors du stockage dans localStorage:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Vérifier que l'URI du backend est définie
      if (!databaseUri) {
        throw new Error("URI du backend non définie. Vérifiez votre variable d'environnement VITE_TESTING_BACKEND_URI.");
      }

      const submissionData = new FormData();
      submissionData.append("name", formData.name.trim());
      submissionData.append("email", formData.email.trim().toLowerCase());
      submissionData.append("contact", formData.contact.trim());
      submissionData.append("password", formData.password);
      submissionData.append("role", formData.role);

      if (formData.role === "student") {
        submissionData.append("level", formData.level);
        submissionData.append("instrument", formData.instrument);
      }

      if (formData.role === "teacher") {
        submissionData.append("speciality", formData.speciality);
        submissionData.append("experience", formData.experience);
        submissionData.append("certificate", certificate);
      }

      const jsonData = Object.fromEntries(submissionData.entries());
      // console.log("Data to be sent:", jsonData);
      // console.log('url', `${databaseUri}/${formData.role}s/register`);

      const response = await axios.post(`${databaseUri}/${formData.role}s/register`, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("Réponse du backend :", response.data);

      const userRole = formData.role.toLowerCase();
      const userData = response.data[userRole];

      if (response.status === 201 || response.status === 200) {
        const userId = userData._id || userData.id;
        console.log("ID utilisateur récupéré :", userId);
        // Stocker les données dans le localStorage après inscription réussie

        if (userId) {
          console.log("ID utilisateur récupéré :", userId);
          localStorage.setItem(`${userRole}Id`, userId); // Par exemple : "teacherId"
          localStorage.setItem(userRole, JSON.stringify(userData)); // Stocke toutes les données
          console.log("Données utilisateur stockées dans localStorage :", userData);
        } else {
          console.error("L'ID utilisateur n'a pas été retourné par le serveur.");
          throw new Error("L'ID utilisateur n'a pas été retourné par le serveur.");
        }

        const fullUserData = {
          ...formData,
          id: userId
        };
        console.log('Données utilisateur complètes:', fullUserData);

        storeUserData(fullUserData);
        setSuccessMsg("Inscription réussie ! Vos données ont été sauvegardées. Redirection vers la page de connexion...");
        setTimeout(() => navigate("/login"), 2000);
      }

      for (let pair of submissionData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

    } catch (err) {
      console.error('Erreur complète:', err);

      let errorMessage = "Échec de l'inscription, veuillez réessayer.";

      if (err.code === 'ECONNABORTED') {
        errorMessage = "Délai d'attente dépassé. Vérifiez votre connexion.";
      } else if (err.response) {
        // Le serveur a répondu avec un code d'erreur
        console.error('Données de la réponse d\'erreur:', err.response.data);
        console.error('Statut:', err.response.status);
        console.error('Headers:', err.response.headers);

        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data?.message || "Données invalides. Vérifiez vos informations.";
            break;
          case 401:
            errorMessage = "Non autorisé. Vérifiez vos identifiants.";
            break;
          case 403:
            errorMessage = "Accès interdit.";
            break;
          case 409:
            errorMessage = "Un compte avec cet email existe déjà.";
            break;
          case 422:
            errorMessage = "Données non valides. Vérifiez tous les champs.";
            break;
          case 500:
            errorMessage = "Erreur serveur interne. Réessayez plus tard ou contactez l'administrateur.";
            break;
          case 502:
            errorMessage = "Serveur indisponible. Réessayez plus tard.";
            break;
          case 503:
            errorMessage = "Service temporairement indisponible.";
            break;
          default:
            errorMessage = err.response.data?.message || `Erreur ${err.response.status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error('Aucune réponse reçue:', err.request);
        errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
      } else {
        // Erreur lors de la configuration de la requête
        console.error('Erreur de configuration:', err.message);
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-400 to-yellow-400 flex items-center justify-center px-4 py-10 font-sans">
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center text-green-900">
        <h1 className="text-4xl font-dancing-script font-bold mb-2 tracking-wide">
          Museschool Register
        </h1>
        <p className="text-lg font-semibold mb-8 text-green-800">
          Rejoignez notre famille musicale !
        </p>

        {/* Affichage de l'URI de debug en mode développement */}
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-gray-600 mb-4">
            Backend URI: {databaseUri || 'Non définie'}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe (min. 6 caractères)"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            required
            minLength={6}
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
          />
          <input
            type="tel"
            name="contact"
            placeholder="Téléphone"
            value={formData.contact}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 bg-white cursor-pointer"
          >
            <option value="" disabled>
              S'inscrire en tant que
            </option>
            <option value="student">Étudiant</option>
            <option value="teacher">Enseignant</option>
          </select>

          {formData.role === "student" && (
            <>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                disabled={loading}
                required
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Choisissez votre niveau d'étude
                </option>
                <option value="easy">Débutant</option>
                <option value="medium">Intermédiaire</option>
                <option value="hard">Avancé</option>
              </select>

              <select
                name="instrument"
                value={formData.instrument}
                onChange={handleInputChange}
                disabled={loading}
                required
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Instrument à apprendre
                </option>
                <option value="piano">Piano</option>
                <option value="flute">Flûte</option>
                <option value="violin">Violon</option>
                <option value="drum">Batterie</option>
              </select>
            </>
          )}

          {formData.role === "teacher" && (
            <>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                disabled={loading}
                required
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Spécialité enseignée
                </option>
                <option value="piano">Piano</option>
                <option value="flute">Flûte</option>
                <option value="violin">Violon</option>
                <option value="drum">Batterie</option>
              </select>

              <input
                type="number"
                name="experience"
                placeholder="Années d'expérience"
                value={formData.experience}
                onChange={handleInputChange}
                disabled={loading}
                min={0}
                max={60}
                required
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
              />

              <div className="space-y-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  disabled={loading}
                  required
                  className="w-full text-green-900 cursor-pointer"
                />
                <p className="text-sm text-green-700">
                  Certificat PDF requis (max 5MB)
                </p>
                {certificate && (
                  <p className="text-sm text-green-900 font-semibold">
                    ✓ Fichier choisi : {certificate.name}
                  </p>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 font-semibold text-center text-sm">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 font-semibold text-center text-sm">
                {successMsg}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-green-900 font-semibold text-center">
          <p>
            Vous avez déjà un compte ?{" "}
            <NavLink
              to="/login"
              className="text-yellow-400 hover:text-yellow-500 underline font-bold"
            >
              Connectez-vous
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Request;