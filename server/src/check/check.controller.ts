import { Controller, Get, Query } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckDto } from './dto/check.dto';

@Controller('/api')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get('/check')
  async check(@Query() query: CheckDto) {
    return await this.checkService.check(
      query.addresses.split(',').map((address) => address.toLocaleLowerCase()),
    );
  }
}
