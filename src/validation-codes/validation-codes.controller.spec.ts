import { Test, TestingModule } from '@nestjs/testing';
import { ValidationCodesController } from './validation-codes.controller';

describe('ValidationCodesController', () => {
  let controller: ValidationCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidationCodesController],
    }).compile();

    controller = module.get<ValidationCodesController>(
      ValidationCodesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
