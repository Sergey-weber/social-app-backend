import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from '../users/dto/create-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    try {
      const candidate = await this.userService.getUserByEmail(userDto.email);

      if (candidate) {
        throw new HttpException(
          'Email уже зарегестрирован!',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const hashPassword = await bcrypt.hash(userDto.password, 5);

        const user = await this.userService.createUser({
          ...userDto,
          password: hashPassword,
        });

        return this.generateToken(user);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  private async generateToken(user: User) {
    const { email, id, roles } = user;
    const payload = { email, id, roles };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }
}
