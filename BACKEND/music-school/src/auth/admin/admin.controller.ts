import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserDto } from '../../DTO/userDto';
import { AdminGuard } from './admin.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/schema/admin.schema';
import { Cron } from '@nestjs/schedule';
import { AdminDto } from 'src/DTO/adminDto';
import { LoginDto } from 'src/DTO/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Admin') // Regroupe les endpoints sous le tag "Admin" dans Swagger
@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('generate-token')
  @ApiOperation({ summary: 'Generate an admin token' })
  @ApiResponse({ status: 200, description: 'Token generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  generateAdminToken(@Body() body: { email: string }) {
    const { email } = body;

    if (email !== 'feyemlionel@gmail.com') {
      throw new UnauthorizedException('Admin introuvable');
    }

    const payload = { email, role: 'admin' };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }

  @UseGuards(AdminGuard)
  @Get('/dashboard')
  @ApiOperation({ summary: 'Get admin dashboard' })
  @ApiResponse({ status: 200, description: 'Admin dashboard data' })
  getAdminDashboard() {
    return { message: 'Bienvenue sur le tableau de bord administrateur !' };
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createAdmin(@Body() createAdminDto: UserDto): Promise<Admin> {
    return this.adminService.createAdmin(createAdminDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'List of all admins' })
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get an admin by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the admin', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Admin details' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async findById(@Param('id') id: string): Promise<Admin> {
    const admin = await this.adminService.findById(id);
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the admin', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async updateAdmin(@Param('id') id: string, @Body() updateAdminDto: Partial<UserDto>): Promise<Admin> {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the admin', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async deleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(id);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login as an admin' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async loginAdmin(@Body() loginDto: LoginDto): Promise<{ token: string; admin: any }> {
    const result = await this.adminService.loginAdmin(loginDto);
    if (!result.admin) {
      throw new NotFoundException('Admin not found');
    }
    return result;
  }

  @Cron('0 0 * * *') // Exécute tous les jours à minuit (UTC)
  @ApiOperation({ summary: 'Send daily admin tokens via email' })
  async sendDailyAdminToken() {
    const admins = await this.adminService.findAll();
    for (const admin of admins) {
      const token = this.jwtService.sign({ id: admin._id, email: admin.email, role: admin.role });
      await this.mailerService.sendMail({
        to: admin.email,
        subject: 'Votre token de connexion quotidien',
        text: `Bonjour, voici votre token de connexion : ${token}`,
      });
    }
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async signUpAdmin(@Body() adminDto: AdminDto): Promise<{ admin: any }> {
    return await this.adminService.signUpAdmin(adminDto);
  }
}
