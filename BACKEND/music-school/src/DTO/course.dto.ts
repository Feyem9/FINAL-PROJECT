import { IsNotEmpty  , IsString, IsNumber } from 'class-validator';




export class CourseDto{

    @IsNotEmpty()
    @IsString()
    readonly title : string;

    @IsNotEmpty()
    @IsString()
    readonly description : string;

    @IsNotEmpty()
    @IsNumber()
    readonly amount : number;

    @IsNotEmpty()
    @IsString()
    readonly level : string;

    @IsNotEmpty()
    @IsString()
    readonly media : 'video' | 'pdf' | 'audio';

    @IsNotEmpty()
    @IsString()
    readonly teacher_id : string; // Assuming teacher_id is a reference to another document

}