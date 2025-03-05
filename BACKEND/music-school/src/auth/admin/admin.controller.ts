import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserDto } from '../../DTO/userDto';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  async createAdmin(@Body() createAdminDto: UserDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const admin = await this.adminService.findById(id);
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  @Put(':id')
  async updateAdmin(@Param('id') id: string, @Body() updateAdminDto: Partial<UserDto>) {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(id);
  }
}
