import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from './role.decorator';
  import { Role } from './role.enum';
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (!requiredRoles) return true;
  
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
  
      if (!authHeader) throw new ForbiddenException('Missing authorization header');
  
      const token = authHeader.replace('Bearer ', '');
      console.log('voici le token du guard' , token);
      
      const decoded = this.jwtService.decode(token) as any;
      console.log('voici le decoded du guard' , decoded);
      
  
      if (!decoded || !decoded.role) {
        throw new ForbiddenException('Invalid or missing role in token');
      }
  
      const userRole = decoded.role as Role;
  
      // 🔐 Autorisation basée sur hiérarchie (ex: ADMIN > TEACHER > STUDENT)
      const roleHierarchy: Role[] = [
        Role.SUPER_ADMIN,
        Role.ADMIN,
        Role.TEACHER,
        Role.STUDENT,
      ];
  
      const userRoleIndex = roleHierarchy.indexOf(userRole);
  
      // ✅ Autorisé si le rôle utilisateur est égal ou supérieur à un des rôles requis
      const isAuthorized = requiredRoles.some((role) => {
        const requiredRoleIndex = roleHierarchy.indexOf(role);
        return userRoleIndex <= requiredRoleIndex;
      });
  
      if (!isAuthorized) {
        throw new ForbiddenException(
          `Access denied for role '${userRole}', requires one of: ${requiredRoles.join(', ')}`,
        );
      }
  
      return true;
    }
  }
  