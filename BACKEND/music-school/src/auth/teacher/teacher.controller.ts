import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { UserDto } from '../../DTO/userDto';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('create')
  async createTeacher(@Body() createTeacherDto: UserDto) {
    return this.teacherService.createTeacher(createTeacherDto);
  }

  @Get()
  async findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const teacher = await this.teacherService.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  @Put(':id')
  async updateTeacher(@Param('id') id: string, @Body() updateTeacherDto: Partial<UserDto>) {
    return this.teacherService.updateTeacher(id, updateTeacherDto);
  }

  @Delete(':id')
  async deleteTeacher(@Param('id') id: string) {
    return this.teacherService.deleteTeacher(id);
  }
}
