import { Module } from '@nestjs/common';
import { ConfigService , ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy:'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory : (config:ConfigService) => {
        return{
          secret : config.get<string>('JWT_SECRET_KEY'),
          signOption:{
            expireIn: config.get<string|number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name:'User' , schema: userSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
