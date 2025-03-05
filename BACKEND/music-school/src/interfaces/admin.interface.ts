
import { User } from './user.interface';

export interface Admin extends User {
readonly   permissions: string[]; // Liste des permissions spécifiques à l'admin

}
