import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // ⚠️ utilise une vraie clé
    });
  }

  async validate(payload: any) {
      console.log('Payload dans JwtStrategy:', payload);
      console.log('Token reçu:', payload);


    try {
      return { id: payload._id, email: payload.email, role: payload.role };
    } catch (error) {
      console.error('Error in JwtStrategy validate:', error);
      throw error; // Propagate the error to the global exception filter
      
    }
  }
}
