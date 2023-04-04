import { Body, Controller, Post } from '@nestjs/common';
import { SignService } from './sign.service';
import { SignDto } from './dto/request';

@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}
  @Post()
  async sign(@Body() dto: SignDto) {
    return this.signService.signHash(dto.address);
  }
}
