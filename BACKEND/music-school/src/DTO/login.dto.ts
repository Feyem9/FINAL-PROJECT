import { IsNotEmpty  , IsEmail , MinLength, IsString } from 'class-validator';



export class LoginDto{

    @IsNotEmpty()
    @IsEmail({} , {message:'please enter a correct email'})
    readonly email : string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8 , {message:'password must be at least 8 characters long'})
    readonly password : string;

} 