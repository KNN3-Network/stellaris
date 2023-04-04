import { Test, TestingModule } from '@nestjs/testing';
import { SignService } from './sign.service';
import { ConfigModule } from '../config/config.module';

describe('SignService', () => {
  let service: SignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [SignService],
    }).compile();

    service = module.get<SignService>(SignService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signHash', async () => {
    await service.signHash(
      '0x061ca8353f215aa7cdd07098d95ff0a709d08288849f537a85e85470ed0cf7a6',
    );
  });
});
