import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../../schema/admin.schema';
import { UserDto } from '../../DTO/userDto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

  async createAdmin(createAdminDto: UserDto): Promise<Admin> {
    const newAdmin = new this.adminModel(createAdminDto);
    return newAdmin.save();
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async findById(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async updateAdmin(id: string, updateAdminDto: Partial<UserDto>): Promise<Admin> {
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(id, updateAdminDto, {
      new: true,
    }).exec();
    if (!updatedAdmin) {
      throw new NotFoundException('Admin not found');
    }
    return updatedAdmin;
  }

  async deleteAdmin(id: string): Promise<void> {
    const result = await this.adminModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Admin not found');
    }
  }
}
