import { Test, TestingModule } from '@nestjs/testing';
import { AnnonceController } from './annonce.controller';

describe('AnnonceController', () => {
  let controller: AnnonceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnonceController],
    }).compile();

    controller = module.get<AnnonceController>(AnnonceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
