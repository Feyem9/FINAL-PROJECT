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

    return { id: payload._id, email: payload.email, role: payload.role };
  }
}
