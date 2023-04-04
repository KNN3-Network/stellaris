import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { CheckModule } from './check/check.module';
import { SignModule } from './sign/sign.module';

@Module({
  imports: [ConfigModule, PrismaModule, CheckModule, SignModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
