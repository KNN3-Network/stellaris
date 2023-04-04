import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignDto {
  @ApiProperty({
    description: 'address',
    required: true,
  })
  @IsNotEmpty()
  address: string;
}
