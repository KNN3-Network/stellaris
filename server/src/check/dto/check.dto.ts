import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CheckDto {
  @ApiProperty({
    description: 'addresses',
    required: true,
  })
  @IsNotEmpty()
  addresses: string;
}
