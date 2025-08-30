// import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AdminGuard implements CanActivate {

//   constructor(
//     private reflector: Reflector, private jwtService: JwtService ,
//     private readonly configService : ConfigService
//   ) { }

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {

//     const request = context.switchToHttp().getRequest<Request>();
//     const authHeader = request.headers['authorization'];

//     console.log("voici le token de l'admin",authHeader);


//     if (!authHeader) {
//       throw new UnauthorizedException('Pas de token fourni');
//     }
//     try {
//       const token = authHeader.split(' ')[1]; // Récupérer le token après "Bearer"
//       console.log(token);
      
//       const decoded = this.jwtService.verify(token , {secret : this.configService.get<string>('JWT_SECRET_KEY')});

//       console.log(decoded); 
      

//       // Vérifier si l'utilisateur est bien admin et a l'email autorisé
//       if (decoded.role !== 'admin' || decoded.email !== 'feyemlionel@gmail.com') {
//         throw new UnauthorizedException('Accès refusé : vous n’êtes pas administrateur');
//       }
//       return true;

//     } catch (error) {
//       throw new UnauthorizedException('Token invalide ou expiré');
//     }
//   }
// }
// // 
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<any>();
    const authHeader = request.headers?.authorization;

    // console.log("voici le token de l'admin", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Pas de token ou token mal formé');
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),

        // secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      console.log(decoded);

      // Vérifie rôle + email si nécessaire
      if (decoded.role !== 'admin' || decoded.email !== 'feyemlionel@gmail.com') {
        throw new ForbiddenException(
          'Accès refusé : seuls les administrateurs autorisés peuvent accéder',
        );
      }
      console.log(request.user);
      request.user = decoded; // Injecte l'utilisateur dans la requête
      return true;

    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
