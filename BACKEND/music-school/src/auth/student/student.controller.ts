import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { StudentService } from './student.service';
import { UserDto } from '../../DTO/userDto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('create')
  async createStudent(@Body() createStudentDto: UserDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get()
  async findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const student = await this.studentService.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  @Put(':id')
  async updateStudent(@Param('id') id: string, @Body() updateStudentDto: Partial<UserDto>) {
    return this.studentService.updateStudent(id, updateStudentDto);
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }
}
