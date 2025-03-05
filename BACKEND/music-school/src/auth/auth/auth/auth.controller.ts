import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/DTO/signup.dto';
import { LoginDto } from 'src/DTO/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService : AuthService){}

    @Post('/register')
    async signUp(@Body() signUpDto : SignUpDto): Promise<{
        // token:string
        user:any;
    }> {
        return await this.authService.signUp(signUpDto)
    }

    @Post('/login')
    async login(@Body() loginDto : LoginDto): Promise<{token : string}>{
        return await this.authService.login(loginDto)
    }

}
