import { Document } from 'mongoose';


export interface Notification extends Document {
    user_id: string;         // ID de l'utilisateur destinataire
    title: string;           // Titre de la notification
    message: string;         // Message de la notification
    read: boolean;           // Statut de lecture
    event_id?: string;       // ID de l'événement lié (optionnel, string conseillé)
    createdAt?: Date;        // Date de création (optionnel)
    updatedAt?: Date;        // Date de mise à jour (optionnel)
}