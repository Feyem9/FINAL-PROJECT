// import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { Observable } from 'rxjs';

// @Injectable()
// export class TeacherGuard implements CanActivate {
//     constructor(
//       private readonly reflector: Reflector, 
//       private readonly jwtService: JwtService,
//       private readonly configService : ConfigService
//     ) {}
  
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {

//     const request = context.switchToHttp().getRequest<any>();
//         const authHeader = request.headers?.authorization;

//     console.log("voici le token du teacher",authHeader);

    
//         if (!authHeader) {
//           throw new ForbiddenException('Access denied: No token provided');
//         }
   
//         try {
//           const token = authHeader.split(' ')[1]; // Extraction du token Bearer

//           console.log(token);
          
//           const decodedToken = this.jwtService.verify(token , {secret : this.configService.get<string>('JWT_SECRET_KEY')}); // Vérification du token
//           console.log(decodedToken);
          
    

//       // Vérifier si l'utilisateur est un enseignant ou un admin
//       if (decodedToken.role === 'teacher' || decodedToken.role === 'admin') {
//         request.user = decodedToken; // injecter l'utilisateur dans la requête

//         return true;
//       } else {
//         throw new ForbiddenException('Access denied: Only teachers and admins are allowed');
//       }
//     } catch (error) {
//       throw new ForbiddenException('Access denied: Invalid token');
//     }
//   }
// }
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TeacherGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<any>();
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Access denied: No valid token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      if (decoded.role === 'teacher' || decoded.role === 'admin') {
        request.user = decoded; // Injecte l'utilisateur dans la requête
        return true;
      } else {
        throw new ForbiddenException(
          'Access denied: Only teachers and admins are allowed',
        );
      }
    } catch (err) {
      throw new ForbiddenException('Access denied: Invalid or expired token');
    }
  }
}
