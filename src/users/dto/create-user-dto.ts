import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Pochta address' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Incorrect Email' })
  readonly email: string;
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: 'Sergio', description: 'Name' })
  readonly name: string;
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'Не меньше 4 и не больше 16 символов' })
  @ApiProperty({ example: '123456', description: 'Password' })
  readonly password: string;
}
