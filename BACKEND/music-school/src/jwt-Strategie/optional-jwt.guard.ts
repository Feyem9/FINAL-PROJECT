import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        // Si l'utilisateur est présent, on le retourne
        if (user) return user;
        if (err) {
            // Si une erreur est présente, on la lance
            throw err;
        }
        if (info && info.name === 'TokenExpiredError') {
            // Si le token est expiré, on ne lance pas d'exception
            return null;
        }
        if (info && info.name === 'JsonWebTokenError') {
            // Si le token est invalide, on ne lance pas d'exception
            return null;
        }
        if (info && info.name === 'NotAuthenticated') {
            // Si l'utilisateur n'est pas authentifié, on ne lance pas d'exception
            return null;
        }
        if (context.switchToHttp().getRequest().headers['authorization']) {
            // Si une requête a un header d'autorisation, on log l'erreur
            console.error('OptionalJwtGuard: Authorization header found but no user authenticated');
        }
        console.log('OptionalJwtGuard: No user found');
        console.log('OptionalJwtGuard: Info from Passport:', info);

        // Si pas d'erreur mais pas de user, on laisse passer sans user
        return user || null;
    }
}
