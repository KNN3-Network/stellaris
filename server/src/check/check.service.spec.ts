import { Test, TestingModule } from '@nestjs/testing';
import { CheckService } from './check.service';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from '../prisma/prisma.module';

describe('SignService', () => {
  let service: CheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ConfigModule],
      providers: [CheckService],
    }).compile();

    service = module.get<CheckService>(CheckService);
  });

  jest.setTimeout(500000000);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('checkEnsOrBnb', async () => {
    const result = await service.checkEnsOrBnb([
      '0x88520C10ad3d35aD2D3220CdE446CcB33f09331B',
    ]);
    console.log('result', result);
  });
});
