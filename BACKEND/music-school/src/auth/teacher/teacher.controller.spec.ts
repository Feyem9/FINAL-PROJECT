import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { TeacherDto } from 'src/DTO/teacherDto';
import { LoginDto } from 'src/DTO/login.dto';
import { NotFoundException } from '@nestjs/common';

describe('TeacherController', () => {
  let teacherController: TeacherController;
  let teacherService: TeacherService;

  const mockTeacherService = {
    createTeacher: jest.fn(),
    sendWelcomeEmail: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateTeacher: jest.fn(),
    deleteTeacher: jest.fn(),
    sendDeletionEmail: jest.fn(),
    verifyTeacher: jest.fn(),
    sendVerificationEmail: jest.fn(),
    signUpTeacher: jest.fn(),
    loginTeacher: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        {
          provide: TeacherService,
          useValue: mockTeacherService,
        },
      ],
    }).compile();

    teacherController = module.get<TeacherController>(TeacherController);
    teacherService = module.get<TeacherService>(TeacherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTeacher', () => {
    it('should create a teacher and send welcome email', async () => {
      const createTeacherDto: TeacherDto = {
        speciality: 'Piano',
        role: 'teacher',
        name: 'Test Teacher',
        email: 'test@example.com',
        password: 'password',
        contact: '1234567890',
      };
      const file = { originalname: 'file.png' } as Express.Multer.File;
      const result = { teacher: { email: 'test@example.com', name: 'Test Teacher' } };
      mockTeacherService.createTeacher.mockResolvedValue(result);

      const response = await teacherController.createTeacher(createTeacherDto, file);

      expect(mockTeacherService.createTeacher).toHaveBeenCalledWith(createTeacherDto, file);
      expect(mockTeacherService.sendWelcomeEmail).toHaveBeenCalledWith(result.teacher.email, result.teacher.name);
      expect(response).toEqual(result);
    });
  });
<<<<<<< SEARCH
  describe('signUpTeacher', () => {
    it('should register a new teacher and send welcome email', async () => {
      const teacherDto: TeacherDto = { speciality: 'Piano' };
      const file = { originalname: 'file.png' } as Express.Multer.File;
      const result = { teacher: { email: 'test@example.com', name: 'Test Teacher' } };
      mockTeacherService.signUpTeacher.mockResolvedValue(result);

      const response = await teacherController.signUpTeacher(teacherDto, file);

      expect(mockTeacherService.signUpTeacher).toHaveBeenCalledWith(teacherDto, file);
      expect(mockTeacherService.sendWelcomeEmail).toHaveBeenCalledWith(result.teacher.email, result.teacher.name);
      expect(response).toEqual(result);
    });
  });
  describe('loginTeacher', () => {
    it('should login a teacher and return token and teacher', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const result = { token: 'token', teacher: { email: 'test@example.com' } };
      mockTeacherService.loginTeacher.mockResolvedValue(result);

      const response = await teacherController.loginTeacher(loginDto);

      expect(response).toEqual(result);
    });

    it('should throw NotFoundException if teacher not found', async () => {
      const loginDto: LoginDto = { email: 'notfound@example.com', password: 'password' };
      mockTeacherService.loginTeacher.mockResolvedValue({ teacher: null });

      await expect(teacherController.loginTeacher(loginDto)).rejects.toThrow(NotFoundException);
    });
=======
  describe('signUpTeacher', () => {
    it('should register a new teacher and send welcome email', async () => {
      const teacherDto: TeacherDto = { speciality: 'Piano' };
      const file = { originalname: 'file.png' } as Express.Multer.File;
      const result = { teacher: { email: 'test@example.com', name: 'Test Teacher' } };
      mockTeacherService.signUpTeacher.mockResolvedValue(result);

      const response = await teacherController.signUpTeacher(teacherDto, file);

      expect(mockTeacherService.signUpTeacher).toHaveBeenCalledWith(teacherDto, file);
      expect(mockTeacherService.sendWelcomeEmail).toHaveBeenCalledWith(result.teacher.email, result.teacher.name);
      expect(response).toEqual(result);
    });
  });
  describe('loginTeacher', () => {
    it('should login a teacher and return token and teacher', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const result = { token: 'token', teacher: { email: 'test@example.com' } };
      mockTeacherService.loginTeacher.mockResolvedValue(result);

      const response = await teacherController.loginTeacher(loginDto);

      expect(response).toEqual(result);
    });

    it('should throw NotFoundException if teacher not found', async () => {
      const loginDto: LoginDto = { email: 'notfound@example.com', password: 'password' };
      mockTeacherService.loginTeacher.mockResolvedValue({ teacher: null });

      await expect(teacherController.loginTeacher(loginDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of teachers', async () => {
      const result = [{ id: '1', speciality: 'Piano' }];
      mockTeacherService.findAll.mockResolvedValue(result);

      expect(await teacherController.findAll()).toEqual(result);
    });
  });

  describe('findById', () => {
    it('should return a teacher by id', async () => {
      const id = '1';
      const teacher = { id, speciality: 'Piano' };
      mockTeacherService.findById.mockResolvedValue(teacher);

      expect(await teacherController.findById(id)).toEqual(teacher);
    });

    it('should throw NotFoundException if teacher not found', async () => {
      const id = '2';
      mockTeacherService.findById.mockResolvedValue(null);

      await expect(teacherController.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTeacher', () => {
    it('should update a teacher', async () => {
      const id = '1';
      const updateTeacherDto: Partial<TeacherDto> = { speciality: 'Violin' };
      const updatedTeacher = { id, speciality: 'Violin' };
      mockTeacherService.updateTeacher.mockResolvedValue(updatedTeacher);

      expect(await teacherController.updateTeacher(id, updateTeacherDto)).toEqual(updatedTeacher);
    });
  });

  describe('deleteTeacher', () => {
    it('should delete a teacher and send deletion email', async () => {
      const id = '1';
      const teacher = { id, email: 'test@example.com', name: 'Test Teacher' };
      mockTeacherService.findById.mockResolvedValue(teacher);
      mockTeacherService.deleteTeacher.mockResolvedValue({ deleted: true });

      const response = await teacherController.deleteTeacher(id);

      expect(mockTeacherService.sendDeletionEmail).toHaveBeenCalledWith(teacher.email, teacher.name);
      expect(response).toEqual({ deleted: true });
    });

    it('should throw NotFoundException if teacher not found', async () => {
      const id = '2';
      mockTeacherService.findById.mockResolvedValue(null);

      await expect(teacherController.deleteTeacher(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyTeacher', () => {
    it('should verify a teacher and send verification email', async () => {
      const id = '1';
      const isVerified = true;
      const teacher = { id, email: 'test@example.com', name: 'Test Teacher' };
      mockTeacherService.verifyTeacher.mockResolvedValue(teacher);

      const response = await teacherController.verifyTeacher(id, isVerified);

      expect(mockTeacherService.sendVerificationEmail).toHaveBeenCalledWith(teacher.email, teacher.name);
      expect(response).toEqual(teacher);
    });
  });

  describe('signUpTeacher', () => {
    it('should register a new teacher and send welcome email', async () => {
      const teacherDto: TeacherDto = {
        speciality: 'Piano',
        role: 'teacher',
        name: 'Test Teacher',
        email: 'test@example.com',
        password: 'password',
        contact: '1234567890',
      };
      const file = { originalname: 'file.png' } as Express.Multer.File;
      const result = { teacher: { email: 'test@example.com', name: 'Test Teacher' } };
      mockTeacherService.signUpTeacher.mockResolvedValue(result);

      const response = await teacherController.signUpTeacher(teacherDto, file);

      expect(mockTeacherService.signUpTeacher).toHaveBeenCalledWith(teacherDto, file);
      expect(mockTeacherService.sendWelcomeEmail).toHaveBeenCalledWith(result.teacher.email, result.teacher.name);
      expect(response).toEqual(result);
    });
  });

  describe('loginTeacher', () => {
    it('should login a teacher and return token and teacher', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const result = { token: 'token', teacher: { email: 'test@example.com' } };
      mockTeacherService.loginTeacher.mockResolvedValue(result);

      const response = await teacherController.loginTeacher(loginDto);

      expect(response).toEqual(result);
    });

    it('should throw NotFoundException if teacher not found', async () => {
      const loginDto: LoginDto = { email: 'notfound@example.com', password: 'password' };
      mockTeacherService.loginTeacher.mockResolvedValue({ teacher: null });

      await expect(teacherController.loginTeacher(loginDto)).rejects.toThrow(NotFoundException);
    });
